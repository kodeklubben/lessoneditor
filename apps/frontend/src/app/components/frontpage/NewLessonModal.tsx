import "./newlessonmodal.scss";
import React, { Dispatch, FC, SetStateAction, SyntheticEvent, useEffect, useState } from "react";
import slugify from "slugify";
import { COURSESLIST, LANGUAGEOPTIONS } from "./settings/newLessonOptions";
import { useUserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router";
import { Button, Input, Modal, Dropdown, Header } from "semantic-ui-react";
import FieldError from "../shared/FieldError";
import { useCatalog } from "../../utils/useCatalog";
import { isCourseSlug, isLessonSlug, isTitle, MAX_TITLE_LENGTH } from "@lessoneditor/contracts";

interface NewLessonModalProps {
  openNewLessonModal: boolean;
  setOpenNewLessonModal: Dispatch<SetStateAction<boolean>>;
}

const toSlug = (text: string) => slugify(text, { lower: true, strict: true });

/** "Micro:bit", "micro bit" and "MICRO" compare alike: letters and digits only, lower case. */
const loose = (text: string) => text.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

/**
 * Whether a search already names a course in the list, so «Legg til nytt kurs» is not offered
 * for it (2): typing "micro" must find Micro:bit, not make a course called micro.
 */
export function matchesCourse(query: string, courses: { text: string; value: string }[]) {
  const wanted = loose(query);
  return (
    wanted.length > 0 &&
    courses.some(
      (course) => loose(course.text).includes(wanted) || loose(course.value).includes(wanted),
    )
  );
}

/** Why the lesson cannot be created from these fields, or null. The slug becomes its folder name. */
export function newLessonProblem(title: string, course: string): string | null {
  if (!title.trim()) return "Oppgavetittel må være satt";
  if (!isTitle(title)) return `Tittelen kan ha høyst ${MAX_TITLE_LENGTH} tegn.`;
  if (!isLessonSlug(toSlug(title)))
    return "Tittelen må ha minst én bokstav (a–z) eller ett tall, og kan ikke være så lang.";
  if (!isCourseSlug(course)) return "Kursnavnet må ha minst én bokstav (a–z) eller ett tall.";
  return null;
}

/** The server's message for a refused lesson (409, 400), otherwise a general one. */
function serverMessage(error: unknown): string {
  const response = (error as { response?: { status?: number; data?: { message?: unknown } } })
    ?.response;
  return typeof response?.data?.message === "string" && response.status === 409
    ? response.data.message
    : "Kunne ikke opprette oppgaven. Prøv igjen litt senere.";
}

interface LessonData {
  lessonTitle: string;
  language: string;
  courses: Array<{ key: string; text: string; value: string }>;
  course: string;
}

const NewLessonModal: FC<NewLessonModalProps> = ({ openNewLessonModal, setOpenNewLessonModal }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addLesson } = useUserContext();
  const catalog = useCatalog();
  const baseCourses = catalog
    ? catalog.courses.map(({ value, text }) => ({ key: value, value, text }))
    : COURSESLIST;
  const defaultState: LessonData = {
    lessonTitle: "",
    language: LANGUAGEOPTIONS[0].value,
    // A copy: a course added in one dialog must not stay in the list after it is cancelled.
    courses: [...baseCourses],
    course: baseCourses[0].value,
  };
  const [lessonData, setLessonData] = useState<LessonData>(defaultState);
  // The repo's courses (#335) once they are read; a course added in this dialog stays.
  useEffect(() => {
    if (!catalog) return;
    setLessonData((prev) => {
      const added = prev.courses.filter(
        (course) =>
          !baseCourses.some((known) => known.value === course.value) &&
          !COURSESLIST.some((known) => known.value === course.value),
      );
      const courses = [...baseCourses, ...added];
      const course = courses.some((c) => c.value === prev.course) ? prev.course : courses[0].value;
      return { ...prev, courses, course };
    });
  }, [catalog]);
  const [openNewCourseModal, setOpenNewCourseModal] = useState(false);
  const [courseSearch, setCourseSearch] = useState("");
  // The course chosen before «Legg til nytt kurs», to go back to if the teacher regrets it.
  const [previousCourse, setPreviousCourse] = useState<string>(baseCourses[0].value);
  const [problem, setProblem] = useState<string | null>(null);

  const onChange = (e: SyntheticEvent, { name, value }: Record<string, string>) => {
    setLessonData((prevValues) => ({ ...prevValues, [name]: value }));
    setProblem(null);
  };

  const addCourseHandler = (e: SyntheticEvent, { value: v }: Record<string, string>) => {
    const newCourseSlug = toSlug(v);
    setPreviousCourse(lessonData.course);
    setLessonData((prevValues) => ({
      ...prevValues,
      courses: [...prevValues.courses, { key: newCourseSlug, text: v, value: newCourseSlug }],
      course: newCourseSlug,
    }));
    setOpenNewCourseModal(true);
  };

  /** «Velg et kurs som finnes»: undoes the new course and goes back to the one before. */
  const regretNewCourse = () => {
    setLessonData((prevValues) => ({
      ...prevValues,
      courses: prevValues.courses.filter((course) => course.value !== prevValues.course),
      course: previousCourse,
    }));
    setOpenNewCourseModal(false);
  };

  const closeModal = () => {
    setLessonData(defaultState);
    setProblem(null);
    setOpenNewLessonModal(false);
  };

  const navigateToEditor = (lessonId: number, lessonSlug: string) => {
    const target = ["/editor", lessonId, lessonSlug, `${lessonData.language}`].join("/");
    const search = "?init";
    navigate({ pathname: target, search: search });
  };
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { course, lessonTitle, language } = lessonData;
    const invalid = newLessonProblem(lessonTitle, course);
    if (invalid) {
      setProblem(invalid);
      return;
    }

    setLoading(true);
    const lesson = { title: lessonTitle.trim(), slug: toSlug(lessonTitle) };
    const courseTitleFromSlug = lessonData.courses.find(({ value }) => value === course);
    try {
      const lessonId = await addLesson(
        course,
        courseTitleFromSlug?.text || "",
        lesson.slug,
        lesson.title,
        language,
      );
      if (lessonId) {
        navigateToEditor(lessonId, lesson.slug);
      }
    } catch (error) {
      setProblem(serverMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal open={openNewCourseModal} onClose={regretNewCourse} size="tiny" dimmer="inverted">
        <Modal.Content>
          <Header as="h2" size="medium">
            Nytt kurs: «{lessonData.courses.find((c) => c.value === lessonData.course)?.text}»
          </Header>
          <p>
            Oppgaven legges i et kurs som ikke finnes ennå. Kurset opprettes når Lær Kidsa Koding
            har gått gjennom innsendingen.
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button basic content="Velg et kurs som finnes" onClick={regretNewCourse} />
          <Button positive content="Bruk nytt kurs" onClick={() => setOpenNewCourseModal(false)} />
        </Modal.Actions>
      </Modal>
      <Modal
        className="new-lesson-modal"
        closeOnDimmerClick={!loading}
        onClose={closeModal}
        onOpen={() => setOpenNewLessonModal(true)}
        open={openNewLessonModal}
        dimmer="inverted"
        trigger={<Button icon="plus" labelPosition="left" content="Ny oppgave" positive />}
      >
        <Modal.Header>Opprett en ny oppgave</Modal.Header>
        <Modal.Content>
          <form id={"skjema-for-oppretting-av-ny-oppgave"} method={"POST"} onSubmit={onSubmit}>
            <section className="new-lesson-modal-container">
              <div className="new-lesson-modal-container__title">
                <label>
                  Tittel (Obligatorisk):
                  <br />
                  <Input
                    className="new-lesson-modal-container__title-input"
                    disabled={loading}
                    autoFocus
                    onChange={onChange}
                    name={"lessonTitle"}
                    defaultValue={lessonData["lessonTitle"]}
                  />
                  <FieldError>{problem}</FieldError>
                </label>
              </div>

              <div className="new-lesson-modal-container__course">
                Kurs:
                <br />
                <Dropdown
                  className="new-lesson-modal-container__course-dropdown"
                  options={lessonData.courses}
                  placeholder={"velg kurs..."}
                  value={lessonData.course}
                  style={{ minWidth: "14em" }}
                  fluid
                  search
                  selection
                  // Leaving the field (or clicking Avbryt) must never pick «Legg til nytt kurs».
                  selectOnBlur={false}
                  selectOnNavigation={false}
                  allowAdditions={!matchesCourse(courseSearch, lessonData.courses)}
                  additionPosition="bottom"
                  onSearchChange={(_e, { searchQuery }) => setCourseSearch(searchQuery)}
                  name="course"
                  additionLabel="Legg til nytt kurs: "
                  onAddItem={addCourseHandler}
                  onChange={(e, data) => {
                    setCourseSearch("");
                    onChange(e, data as unknown as Record<string, string>);
                  }}
                />
              </div>
              <div className="new-lesson-modal-container__language">
                Språk:
                <br />
                <Dropdown
                  className="new-lesson-modal-container__language-dropdown"
                  placeholder="Velg språk"
                  name="language"
                  defaultValue={defaultState.language}
                  selection
                  onChange={onChange}
                  options={LANGUAGEOPTIONS}
                  id="lang_dropdown"
                ></Dropdown>
              </div>
            </section>
          </form>
        </Modal.Content>
        <Modal.Actions className="newLessonModal">
          <Button disabled={loading} onClick={closeModal} content="Avbryt" />
          <Button
            loading={loading}
            form={"skjema-for-oppretting-av-ny-oppgave"}
            type={"submit"}
            content="Neste"
            labelPosition="right"
            icon="right arrow"
            positive
          />
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default NewLessonModal;
