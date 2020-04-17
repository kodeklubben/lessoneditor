import React from "react";
import "./formpage.css";
import FormPage from "./FormPage";
import COURSELIST from "./settingsFiles/COURSELIST";
import { LANGUAGES } from "./settingsFiles/languages/formpage_NO";

class FormComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      course: COURSELIST[0].courseTitle,
      title: "",
      titleErr: "",
      author: "",
      authorErr: "",
      translator: "",
      language: Object.keys(LANGUAGES[0]),
      level: 1,
      license: "",
      tags: { topic: [], subject: [], grade: [] },
      redirect: null,
      pageNumber: 1
    };
  }

  YMLstateToString = state => {
    return (
      "level: " +
      state.level +
      (state.license ? "\nlicense: " + state.license : "") +
      "\ntags:\n    topic: [" +
      state.tags.topic +
      "]\n    subject: [" +
      state.tags.subject +
      "]\n    grade: [" +
      state.tags.grade +
      "]"
    );
  };

  YAMLstateToString = state => {
    return (
      "---\ntitle: " +
      state.title +
      "\nauthor: " +
      state.author +
      (state.translator ? "\ntranslator: " + state.translator : "") +
      "\nlanguage: " +
      state.language +
      "\n---"
    );
  };

  submitHandler = event => {
    event.preventDefault();
    console.log(event);

    this.setState({ redirect: "/editor" });

    console.log("YAML header: \n" + this.YAMLstateToString(this.state));
    console.log("\nYML-file: \n" + this.YMLstateToString(this.state));
    // TODO: Send state-data to database
  };

  changeHandler = event => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
  };

  checkboxHandler = event => {
    let name = event.target.name;
    let value = event.target.value;

    let i = this.state.tags;
    if (i[name].includes(value)) {
      i[name].splice(i[name].indexOf(value), 1);
    } else {
      i[name].push(value);
    }
    this.setState({ tags: i });
  };

  setPageNumber = input => {
    this.setState({ pageNumber: input });
  };

  setErr = (titleErr, authorErr) => {
    if (titleErr) {
      this.setState({ titleErr });
    }
    if (authorErr) {
      this.setState({ authorErr });
    }
  };

  render() {
    return (
      <div>
        <FormPage
          submitHandler={this.submitHandler}
          changeHandler={this.changeHandler}
          checkboxHandler={this.checkboxHandler}
          setPageNumber={this.setPageNumber}
          setErr={this.setErr}
          state={this.state}
        />
      </div>
    );
  }
}

export default FormComponent;
