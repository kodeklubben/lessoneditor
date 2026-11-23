import "./newlessonmodal.scss";
import React, { Dispatch, FC, SetStateAction, SyntheticEvent, useState } from "react";
import slugify from "slugify";
import { COURSESLIST, LANGUAGEOPTIONS } from "./settings/newLessonOptions";
import { useUserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router";
import { Button, Input, Modal, Dropdown } from "semantic-ui-react";
import FieldError from "../shared/FieldError";
import { isCourseSlug, isLessonSlug, isTitle, MAX_TITLE_LENGTH } from "@lessoneditor/contracts";

interface NewLessonModalProps {
  openNewLessonModal: boolean;
  setOpenNewLessonModal: Dispatch<SetStateAction<boolean>>;
}

const toSlug = (text: string) => slugify(text, { lower: true, strict: true });

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
  const defaultState: LessonData = {
    lessonTitle: "",
    language: LANGUAGEOPTIONS[0].value,
    courses: COURSESLIST,
    course: COURSESLIST[0].value,
  };
  const [lessonData, setLessonData] = useState<LessonData>(defaultState);
  const [openNewCourseModal, setOpenNewCourseModal] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  const onChange = (e: SyntheticEvent, { name, value }: Record<string, string>) => {
    setLessonData((prevValues) => ({ ...prevValues, [name]: value }));
    setProblem(null);
  };

  const addCourseHandler = (e: SyntheticEvent, { value: v }: Record<string, string>) => {
    const tempCourselist = COURSESLIST;
    const newCourseSlug = toSlug(v);
    tempCourselist.push({ key: newCourseSlug, text: v, value: newCourseSlug });
    setLessonData((prevValues) => ({
      ...prevValues,
      course: newCourseSlug,
    }));

    setOpenNewCourseModal(true);
    COURSESLIST.splice(0, COURSESLIST.length, ...tempCourselist);
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
      <Modal
        open={openNewCourseModal}
        onClose={() => setOpenNewCourseModal(false)}
        header="Opprette et nytt kurs"
        content="Kurset vil bli opprettet når moderatorer har gått gjennom innleveringen"
        actions={[{ key: "Ok", content: "Ok", positive: true }]}
      />
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
                  allowAdditions
                  name="course"
                  additionLabel="Legg til nytt kurs: "
                  onAddItem={addCourseHandler}
                  onChange={onChange}
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
