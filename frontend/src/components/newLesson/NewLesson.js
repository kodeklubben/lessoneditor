import React, { useContext, useState } from "react";
import slugify from "slugify";
import COURSESLIST from "../lessonForm/settingsFiles/COURSELIST";
import { UserContext } from "../../contexts/UserContext";
import { useHistory } from "react-router";

const NewLesson = () => {
  const history = useHistory();
  const user = useContext(UserContext);
  const [values, setValues] = useState({});
  const [error, setError] = useState("kurs og tittel må være satt");
  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
    const { course, title } = values;
    if (course && title) {
      setError("");
    } else {
      setError("kurs og tittel må være satt");
    }
  };
  const navigateToEditor = (course, lesson) => {
    const target = ["/editor", course, lesson, lesson].join("/");
    history.push(target);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const { course, title } = values;
    if (course && title) {
      const lesson = slugify(title);
      await user.addLesson(course, lesson, title);
      navigateToEditor(course, lesson);
    } else {
      setError("kurs eller tittel er ikke satt");
    }
  };
  return (
    <form className="ui form" method={"POST"} onSubmit={onSubmit}>
      <input
        onChange={onChange}
        name={"title"}
        defaultValue={values["title"]}
      />
      <select className="ui dropdown" name="course" onChange={onChange}>
        {COURSESLIST.map((course) => (
          <option key={course.slug} value={course.slug} name={"course"}>
            {course.courseTitle}
          </option>
        ))}
      </select>
      <button type={"submit"} disabled={error.length > 0}>
        SUBMIT
      </button>
      <i>{error}</i>
    </form>
  );
};

export default NewLesson;
