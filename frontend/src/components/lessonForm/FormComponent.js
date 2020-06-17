import "./formpage.css";
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import FormPage from "./FormPage";
import COURSELIST from "./settingsFiles/COURSELIST";
import { LANGUAGES } from "./settingsFiles/languages/formpage_NO";

const FormComponent = () => {
  const [state, setState] = useState({
    course: COURSELIST[0].courseTitle,
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

  const submitHandler = (event) => {
    setState((prevState) => ({ ...prevState, redirect: "/editor" }));

    console.log("YAML header: \n" + YAMLstateToString(state));
    console.log("\nYML-file: \n" + YMLstateToString(state));
    // TODO: Send state-data to database
  };

  const changeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    setState((prevState) => ({ ...prevState, [nam]: val }));
    if (state.author) setState((prevState) => ({ ...prevState, err: "" }));
    if (state.title) setState((prevState) => ({ ...prevState, err: "" }));
  };

  const multiInputHandler = (object, field) => {
    console.log(field);
    let key = Object.keys(object)[0];
    let value = Object.values(object)[0];
    setState((prevState) => ({ ...prevState, [key]: value }));
    setState((prevState) => ({ ...prevState, [field]: "" }));
    console.log(state[field]);
    console.log(state.authorList);
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
  );
};

export default FormComponent;
