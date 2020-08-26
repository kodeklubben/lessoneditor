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
  const navigateToLandingpage = (lessonId) => {
    const target = ["/landingpage", lessonId].join("/");
    history.push({ pathname: "/empty" });
    history.replace({ pathname: target });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const { course, title } = values;
    if (title) {
      const lesson = slugify(title);
      const lessonId = await user.addLesson(course, title, "no title");
      navigateToLandingpage(lessonId, lesson);
    } else {
      setError("tittel er ikke satt");
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
