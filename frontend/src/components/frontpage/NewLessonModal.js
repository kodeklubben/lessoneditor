import React, { useContext, useState } from "react";
import slugify from "slugify";
import { COURSESLIST } from "components/editor/settingsFiles/COURSELIST";
import { UserContext } from "../../contexts/UserContext";
import { useHistory } from "react-router";
import {
  Button,
  Grid,
  GridColumn,
  Input,
  Icon,
  Modal,
} from "semantic-ui-react";

const NewLessonModal = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const user = useContext(UserContext);
  const [values, setValues] = useState({
    lessonTitle: "",
    course: COURSESLIST[0].slug,
  });
  const [error, setError] = useState("Oppgavetittel må være satt");

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
    const { lessonTitle } = values;
    if (lessonTitle.length >= 0) {
      setError("");
    } else if (!lessonTitle) {
      setError("Oppgavetittel må være satt");
    }
  };
  const navigateToLandingpage = (lessonId, lessonSlug) => {
    const target = ["/editor", lessonId, lessonSlug, "nb"].join("/");
    history.push({ pathname: target });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { course, lessonTitle } = values;
    if (lessonTitle) {
      const lessonSlug = slugify(lessonTitle);
      const lessonId = await user.addLesson(course, lessonSlug, lessonTitle);
      navigateToLandingpage(lessonId, lessonSlug);
    } else {
      setError("Oppgavetittel er ikke satt");
    }
    setLoading(false);
  };
  return (
    <>
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        dimmer={"blurring"}
        open={open}
        trigger={
          <Button icon labelPosition="left" positive>
            <Icon name="plus" />
            Ny oppgave
          </Button>
        }
      >
        <Modal.Header>Opprett en ny oppgave</Modal.Header>
        <Modal.Content>
          <form
            id={"skjema-for-oppretting-av-ny-oppgave"}
            method={"POST"}
            onSubmit={onSubmit}
          >
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
                    {COURSESLIST.map((course) => (
                      <option
                        key={course.slug}
                        value={course.slug}
                        name={"course"}
                      >
                        {course.courseTitle}
                      </option>
                    ))}
                  </select>
                </label>
              </GridColumn>
            </Grid>
          </form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            loading={loading}
            form={"skjema-for-oppretting-av-ny-oppgave"}
            type={"submit"}
            disabled={values.lessonTitle.length === 0}
          >
            Neste
          </Button>
          <Button disabled={loading} onClick={() => setOpen(false)}>
            Avbryt
          </Button>
          <br />
          <i style={{ color: "red" }}>{error}</i>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default NewLessonModal;
