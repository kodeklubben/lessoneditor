import "./formpage.scss";
import React, { useContext, useState } from "react";
import FormPage from "./FormPage";
import Navbar from "components/navbar/Navbar";
import COURSELIST from "./settingsFiles/COURSELIST";
import { LANGUAGES } from "./settingsFiles/languages/formpage_NO";
import { UserContext } from "../../contexts/UserContext";
import { useHistory } from "react-router";
import slugify from "slugify";

const FormComponent = () => {
  const [state, setState] = useState({
    course: COURSELIST[0].slug,
    title: "",
    err: "",
    author: "",
    authorList: [],
    authorErr: "",
    translator: "",
    translatorList: [],
    language: Object.keys(LANGUAGES[0]),
    level: 1,
    license: "CC BY-SA 4.0",
    tags: { topic: [], subject: [], grade: [] },
    redirect: null,
    pageNumber: 1,
  });

  const YMLstateToString = ({ level, license, tags }) => {
    return (
      "level: " +
      level +
      (license ? "\nlicense: " + license : "") +
      (tags.topic.length > 0 || tags.subject.length > 0 || tags.grade.length > 0
        ? "\ntags:\n    " +
          (tags.topic.length > 0 ? "topic: [" + tags.topic + "]\n    " : "") +
          (tags.subject.length > 0
            ? "subject: [" + tags.subject + "]\n    "
            : "") +
          (tags.grade.length > 0 ? "grade: [" + tags.grade + "]" : "")
        : "")
    );
  };

  const YAMLstateToString = ({
    title,
    authorList,
    translatorList,
    language,
  }) => {
    return (
      "---\ntitle: " +
      title +
      "\nauthor: " +
      authorList.join(" og ") +
      (translatorList.length > 0
        ? "\ntranslator: " + translatorList.join(" og ")
        : "") +
      "\nlanguage: " +
      language +
      "\n---"
    );
  };

  const history = useHistory();
  const user = useContext(UserContext);

  const navigateToEditor = (lessonId, file) => {
    const target = ["/editor", lessonId, file].join("/");
    history.push(target);
  };

  const submitHandler = async (event) => {
    setState((prevState) => ({ ...prevState }));

    console.log("YAML header: \n" + YAMLstateToString(state));
    console.log("\nYML-file: \n" + YMLstateToString(state));
    // TODO: Send state-data to database
    const { course, title } = state;

    if (course && title) {
      const lesson = slugify(title);
      const lessonId = await user.addLesson(course, lesson, title);
      navigateToEditor(lessonId, lesson);
    }
  };

  const changeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    setState((prevState) => ({ ...prevState, [nam]: val }));
    if (state.author) setState((prevState) => ({ ...prevState, err: "" }));
    if (state.title) setState((prevState) => ({ ...prevState, err: "" }));
  };

  const multiInputHandler = (object, field) => {
    let key = Object.keys(object)[0];
    let value = Object.values(object)[0];
    setState((prevState) => ({ ...prevState, [key]: value }));
    setState((prevState) => ({ ...prevState, [field]: "" }));
  };

  const checkboxHandler = (event) => {
    let name = event.target.name;
    let value = event.target.value;

    let i = state.tags;
    if (i[name].includes(value)) {
      i[name].splice(i[name].indexOf(value), 1);
    } else {
      i[name].push(value);
    }
    setState((prevState) => ({ ...prevState, tags: i }));
  };

  const selectDropdownHandler = (event, data) => {
    if (data) {
      let name = data.subtag;
      let value = data.value;

      let i = state.tags;

      i[name] = value;

      setState((prevState) => ({ ...prevState, tags: i }));
    }
  };

  const setPageNumber = (input) => {
    setState((prevState) => ({ ...prevState, pageNumber: input }));
    setState((prevState) => ({ ...prevState, err: "" }));
  };

  const setErr = (err) => {
    setState((prevState) => ({ ...prevState, err }));
  };

  return (
    <>
      <Navbar />
      <FormPage
        submitHandler={submitHandler}
        changeHandler={changeHandler}
        checkboxHandler={checkboxHandler}
        multiInputHandler={multiInputHandler}
        selectDropdownHandler={selectDropdownHandler}
        setPageNumber={setPageNumber}
        setErr={setErr}
        state={state}
      />
    </>
  );
};

export default FormComponent;
