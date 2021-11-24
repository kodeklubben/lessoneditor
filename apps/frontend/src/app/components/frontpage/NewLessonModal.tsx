import "./newlessonmodal.scss";

import { FC, SyntheticEvent, useState } from "react";
import slugify from "slugify";
import { COURSESLIST } from "../editor/settingsFiles/COURSELIST";
import { useUserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router";
import { Button, Grid, GridColumn, Input, Modal, Dropdown, Ref } from "semantic-ui-react";
import ShowSpinner from "../ShowSpinner";

const courseDropdownOptions = COURSESLIST.map((e) => {
  return { key: e.slug, text: e.courseTitle, value: e.courseTitle };
});

const NewLessonModal: FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addLesson } = useUserContext();
  const defaultState = {
    lessonTitle: "",
    courses: courseDropdownOptions,
    course: COURSESLIST[0].slug,
  };
  const [values, setValues] = useState(defaultState);
  const [openNewCourseModal, setOpenNewCourseModal] = useState(false);
  const [isEmptyField, setIsEmptyField] = useState(false);

  const errorMessage = "Oppgavetittel må være satt";

  const onChange = (e: SyntheticEvent, { name, value }: Record<string, string>) => {
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const addCourseHandler = (e: SyntheticEvent, { value }: Record<string, string>) => {
    const tempCourselist = COURSESLIST;
    const newCourseSlug = slugify(value, { lower: true, strict: true });
    tempCourselist.push({ courseTitle: value, slug: newCourseSlug });
    setValues((prevValues) => ({
      ...prevValues,
      courses: [{ key: newCourseSlug, text: value, value }, ...prevValues.courses],
    }));

    setOpenNewCourseModal(true);
    COURSESLIST.splice(0, COURSESLIST.length, ...tempCourselist);
  };

  const onBlur = (e: any) => {
    setIsEmptyField(true);
  };
  const closeModal = () => {
    setValues(defaultState);
    setIsEmptyField(false);
    setOpen(false);
  };
  const navigateToEditor = (lessonId: number, lessonSlug: string) => {
    const target = ["/editor", lessonId, lessonSlug].join("/");
    navigate({ pathname: target });
  };
  const onSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    const { course, lessonTitle } = values;

    const courseSlug = slugify(course, { lower: true, strict: true });

    const lesson = {
      title: lessonTitle,
      slug: slugify(lessonTitle, { lower: true, strict: true }),
    };
    const getCourseFromSlug = COURSESLIST.find(({ slug }) => slug === courseSlug);

    const courseTitle: string = getCourseFromSlug ? getCourseFromSlug.courseTitle : "";
    const lessonId = await addLesson(course, courseTitle, lesson.slug, lesson.title);
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
      {loading ? <ShowSpinner /> : ""}
      <Modal
        closeOnDimmerClick={!loading}
        onClose={() => closeModal()}
        onOpen={() => setOpen(true)}
        open={open}
        dimmer="inverted"
        trigger={<Button icon="plus" labelPosition="left" positive content="Ny oppgave" />}
      >
        <Modal.Header className="newLessonModal">Opprett en ny oppgave</Modal.Header>
        <Modal.Content className="newLessonModal">
          <form id={"skjema-for-oppretting-av-ny-oppgave"} method={"POST"} onSubmit={onSubmit}>
            <Grid className={"equal width"}>
              <GridColumn>
                <label>
                  Tittel:
                  <br />
                  <Input
                    disabled={loading}
                    autoFocus
                    onBlur={onBlur}
                    onChange={onChange}
                    name={"lessonTitle"}
                    defaultValue={values["lessonTitle"]}
                  />
                  {!values.lessonTitle && isEmptyField ? (
                    <p>
                      <i style={{ color: "red" }}>{errorMessage}</i>
                    </p>
                  ) : (
                    <p style={{ height: "1.35em" }} />
                  )}
                </label>
              </GridColumn>
              <GridColumn>
                <label>
                  Kurs:
                  <br />
                  <Dropdown
                    options={values.courses}
                    placeholder={COURSESLIST[0].courseTitle}
                    selection
                    search
                    allowAdditions
                    name="course"
                    value={values.course}
                    additionLabel="Legg til nytt kurs: "
                    onAddItem={addCourseHandler}
                    onChange={onChange}
                  />
                  {/* <select
                    className="ui dropdown"
                    name="course"
                    onChange={onChange}
                    disabled={loading}
                  >
                    {COURSESLIST.map((course: { courseTitle: string; slug: string }) => (
                      <option key={course.slug} value={course.slug}>
                        {course.courseTitle}
                      </option>
                    ))}
                  </select> */}
                </label>
              </GridColumn>
            </Grid>
          </form>
        </Modal.Content>
        <Modal.Actions className="newLessonModal">
          <Button disabled={loading} color="black" onClick={closeModal} content="Avbryt" />
          <Button
            loading={loading}
            form={"skjema-for-oppretting-av-ny-oppgave"}
            type={"submit"}
            disabled={values.lessonTitle.length === 0}
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
