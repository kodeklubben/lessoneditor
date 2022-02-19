import "./newlessonmodal.scss";

import { FC, SyntheticEvent, useState } from "react";
import slugify from "slugify";
import { COURSESLIST, LANGUAGEOPTIONS } from "./settings/newLessonOptions";
import { useUserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router";
import { Button, Grid, GridColumn, Input, Modal, Dropdown, Ref } from "semantic-ui-react";

// import ShowSpinner from "../ShowSpinner";

type NewLessonModalProps = {
  openNewLessonModal: boolean;
  setOpenNewLessonModal: any;
};

const NewLessonModal: FC<NewLessonModalProps> = ({ openNewLessonModal, setOpenNewLessonModal }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addLesson } = useUserContext();
  const defaultState = {
    lessonTitle: "",
    language: LANGUAGEOPTIONS[0].value,
    courses: COURSESLIST,
    course: COURSESLIST[0].value,
  };
  const [lessonData, setLessonData] = useState(defaultState);
  const [openNewCourseModal, setOpenNewCourseModal] = useState(false);
  const [isEmptyField, setIsEmptyField] = useState(false);

  const errorMessage = "Oppgavetittel må være satt";

  const onChange = (e: SyntheticEvent, { name, value }: Record<string, string>) => {
    setLessonData((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const addCourseHandler = (e: SyntheticEvent, { value: v }: Record<string, string>) => {
    const tempCourselist = COURSESLIST;
    const newCourseSlug = slugify(v, { lower: true, strict: true });
    tempCourselist.push({ key: newCourseSlug, text: v, value: newCourseSlug });
    setLessonData((prevValues) => ({
      ...prevValues,
      course: newCourseSlug,
    }));

    setOpenNewCourseModal(true);
    COURSESLIST.splice(0, COURSESLIST.length, ...tempCourselist);
  };

  const onBlur = (e: any) => {
    setIsEmptyField(true);
  };
  const closeModal = () => {
    setLessonData(defaultState);
    setIsEmptyField(false);
    setOpenNewLessonModal(false);
  };
  const navigateToEditor = (lessonId: number, lessonSlug: string) => {
    const target = ["/editor", lessonId, lessonSlug, lessonData.language].join("/");
    navigate({ pathname: target });
  };
  const onSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    const { course, lessonTitle, language } = lessonData;

    const lesson = {
      title: lessonTitle,
      slug: slugify(lessonTitle, { lower: true, strict: true }),
    };
    const courseTitleFromSlug = COURSESLIST.find(({ value }) => value === course);
    const lessonId = await addLesson(
      course,
      courseTitleFromSlug?.text,
      lesson.slug,
      lesson.title,
      language
    );
    if (lessonId) {
      navigateToEditor(lessonId, lesson.slug);
    }

    setLoading(false);
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
        closeOnDimmerClick={!loading}
        onClose={() => closeModal()}
        onOpen={() => setOpenNewLessonModal(true)}
        open={openNewLessonModal}
        dimmer="inverted"
        trigger={<Button icon="plus" labelPosition="left" content="Ny oppgave" positive />}
      >
        <Modal.Header className="newLessonModal">Opprett en ny oppgave</Modal.Header>
        <Modal.Content className="newLessonModal">
          <form id={"skjema-for-oppretting-av-ny-oppgave"} method={"POST"} onSubmit={onSubmit}>
            <div style={{ display: "flex", flexFlow: "row wrap" }}>
              <div style={{ margin: "0 3em 2em 0" }}>
                <label>
                  Tittel:
                  <br />
                  <Input
                    disabled={loading}
                    autoFocus
                    onBlur={onBlur}
                    onChange={onChange}
                    name={"lessonTitle"}
                    defaultValue={lessonData["lessonTitle"]}
                  />
                  {!lessonData.lessonTitle && isEmptyField ? (
                    <p>
                      <i style={{ color: "red" }}>{errorMessage}</i>
                    </p>
                  ) : (
                    <p style={{ height: "1.35em" }} />
                  )}
                </label>
              </div>
              <div style={{ margin: "0 3em 2em 0" }}>
                Kurs:
                <br />
                <Dropdown
                  options={lessonData.courses}
                  placeholder={"velg kurs..."}
                  value={lessonData.course}
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
              <div>
                Språk:
                <br />
                <Dropdown
                  placeholder="Velg Språk"
                  name="language"
                  defaultValue={defaultState.language}
                  selection
                  onChange={onChange}
                  options={LANGUAGEOPTIONS}
                  id="lang_dropdown"
                ></Dropdown>
              </div>
            </div>
          </form>
        </Modal.Content>
        <Modal.Actions className="newLessonModal">
          <Button disabled={loading} onClick={closeModal} content="Avbryt" />
          <Button
            loading={loading}
            form={"skjema-for-oppretting-av-ny-oppgave"}
            type={"submit"}
            disabled={lessonData.lessonTitle.length === 0}
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
