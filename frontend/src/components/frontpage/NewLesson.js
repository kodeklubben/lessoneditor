import React, { useContext, useState } from "react";
import slugify from "slugify";
import COURSESLIST from "../lessonForm/settingsFiles/COURSELIST";
import { UserContext } from "../../contexts/UserContext";
import { useHistory } from "react-router";

const NewLesson = ({ setShowPopup }) => {
  const history = useHistory();
  const user = useContext(UserContext);
  const [values, setValues] = useState({
    name: "",
    course: COURSESLIST[0].slug,
  });
  const [error, setError] = useState("Kurs og tittel må være satt");
  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
    const { title } = values;
    if (title) {
      setError("");
    } else {
      setError("kurs og tittel må være satt");
    }
  };
  const navigateToEditor = (lessonId) => {
    const target = ["/landingpage", lessonId].join("/");
    history.push(target);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const { course, title } = values;
    if (title) {
      const lesson = slugify(title);
      const lessonId = await user.addLesson(course, title);
      navigateToEditor(lessonId, lesson);
    } else {
      setError("tittel er ikke satt");
    }
  };
  return (
    <div>
      <form
        style={{
          position: "absolute",
          backgroundColor: "white",
          border: "1px solid black",
          borderRadius: "10px",
          padding: "5em",
          left: "20%",
          top: "20%",
          zIndex: "1",
        }}
        className="ui form"
        method={"POST"}
        onSubmit={onSubmit}
      >
        <i
          onClick={() => setShowPopup(false)}
          className="big grey x icon editor"
        />
        <label>
          Tittel:
          <input
            onChange={onChange}
            name={"title"}
            defaultValue={values["title"]}
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
            disabled={error.length > 0}
          >
            Send inn
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
