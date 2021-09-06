import "./newlessonmodal.scss";

import { FC, useState } from "react";
import slugify from "slugify";
import { COURSESLIST } from "../editor/settingsFiles/COURSELIST";
import { useUserContext } from "../../contexts/UserContext";
import { useHistory } from "react-router";
import { Button, Grid, GridColumn, Input, Modal } from "semantic-ui-react";
import ShowSpinner from "../ShowSpinner";

const NewLessonModal: FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { addLesson } = useUserContext();
  const defaultState = {
    lessonTitle: "",
    course: COURSESLIST[0].slug,
  };
  const [values, setValues] = useState(defaultState);

  const errorMessage = "Oppgavetittel må være satt";

  const onChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
  };
  const navigateToEditor = (lessonId: string, lessonSlug: string) => {
    const target = ["/editor", lessonId, lessonSlug, "nb"].join("/");
    history.push({ pathname: target });
  };
  const onSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    const { course, lessonTitle } = values;

    const lesson = {
      title: lessonTitle,
      slug: slugify(lessonTitle, { lower: true, strict: true }),
    };
    const getCourseFromSlug = COURSESLIST.find(({ slug }) => slug === values.course);
    const courseTitle: string = getCourseFromSlug ? getCourseFromSlug.courseTitle : "";
    const lessonId = await addLesson(course, courseTitle, lesson.slug, lesson.title);
    navigateToEditor(lessonId, lesson.slug);
    setLoading(false);
  };

  return (
    <>
      {loading ? <ShowSpinner /> : ""}
      <Modal
        closeOnDimmerClick={!loading}
        onClose={() => setOpen(false)}
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
                    onChange={onChange}
                    name={"lessonTitle"}
                    defaultValue={values["lessonTitle"]}
                  />
                  {!values.lessonTitle ? (
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
                  <select
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
                  </select>
                </label>
              </GridColumn>
            </Grid>
          </form>
        </Modal.Content>
        <Modal.Actions className="newLessonModal">
          <Button
            disabled={loading}
            color="black"
            onClick={() => {
              setValues(defaultState);
              setOpen(false);
            }}
            content="Avbryt"
          />
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
