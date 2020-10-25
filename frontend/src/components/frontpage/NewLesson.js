import React, { useContext, useState } from "react";
import slugify from "slugify";
import COURSESLIST from "../editor/settingsFiles/COURSELIST";
import { UserContext } from "../../contexts/UserContext";
import { useHistory } from "react-router";

const githubUrl =
  "https://github.com/kodeklubben/oppgaver/blob/master/filtertags/keys.yml";

const NewLesson = ({ setShowPopup, setShowSpinner }) => {
  console.log(fetch(githubUrl));

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
  const navigateToLandingpage = (lessonId, lesson) => {
    const target = ["/editor", lessonId, lesson, "nb"].join("/");
    history.push({ pathname: target });
    setShowSpinner(false);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    setShowSpinner(true);
    const { course, lessonTitle } = values;
    if (lessonTitle) {
      const lesson = slugify(lessonTitle);
      const lessonId = await user.addLesson(course, lesson);
      navigateToLandingpage(lessonId, lesson);
    } else {
      setError("Oppgavetittel er ikke satt");
    }
  };
  return (
    <div
      style={{
        position: "absolute",
        top: "0%",
        left: "0%",
        zIndex: "1",
        width: "100%",
        height: "100%",
        backgroundColor: "rgb(256,256,256,0.7)",
      }}
    >
      <form
        style={{
          zIndex: "2",
          margin: "auto",
          marginTop: "10%",
          backgroundColor: "white",
          border: "1px solid black",
          borderRadius: "10px",
          padding: "7% 10%",
          width: "50%",
          height: "50%",
          boxShadow: "0px 0px 5px",
        }}
        className="ui form"
        method={"POST"}
        onSubmit={onSubmit}
      >
        <i
          onClick={() => setShowPopup(false)}
          className="big grey x icon frontpage"
        />
        <br />
        <label>
          Tittel:
          <input
            autoFocus
            onChange={onChange}
            name={"lessonTitle"}
            defaultValue={values["lessonTitle"]}
          />
        </label>
        <label>
          Kurs:
          <select className="ui dropdown" name="course" onChange={onChange}>
            {COURSESLIST.map((course) => (
              <option key={course.slug} value={course.slug} name={"course"}>
                {course.courseTitle}
              </option>
            ))}
          </select>
        </label>
        <div style={{ marginTop: "5em" }}>
          <button
            className="ui button"
            type={"submit"}
            disabled={values.lessonTitle.length === 0}
          >
            Neste
          </button>
          <button className="ui button" onClick={() => setShowPopup(false)}>
            Avbryt
          </button>
          <i style={{ color: "red" }}>{error}</i>
        </div>
      </form>
    </div>
  );
};

export default NewLesson;
