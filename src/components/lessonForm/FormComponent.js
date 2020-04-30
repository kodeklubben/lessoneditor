import "./formpage.css";
import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import FormPage from "./FormPage";
import COURSELIST from "./settingsFiles/COURSELIST";
import { LANGUAGES } from "./settingsFiles/languages/formpage_NO";

class FormComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      pageNumber: 1
    };
  }

  YMLstateToString = state => {
    return (
      "level: " +
      state.level +
      (state.license ? "\nlicense: " + state.license : "") +
      (state.tags.topic.length > 0 ||
      state.tags.subject.length > 0 ||
      state.tags.grade.length > 0
        ? "\ntags:\n    " +
          (state.tags.topic.length > 0
            ? "topic: [" + state.tags.topic + "]\n    "
            : "") +
          (state.tags.subject.length > 0
            ? "subject: [" + state.tags.subject + "]\n    "
            : "") +
          (state.tags.grade.length > 0
            ? "grade: [" + state.tags.grade + "]"
            : "")
        : "")
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
    // event.preventDefault();

    this.setState({ redirect: "/editor" });

    console.log("YAML header: \n" + this.YAMLstateToString(this.state));
    console.log("\nYML-file: \n" + this.YMLstateToString(this.state));
    // TODO: Send state-data to database
  };

  changeHandler = event => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
    if (this.state.author) this.setState({ err: "" });
    if (this.state.title) this.setState({ err: "" });
  };

  multiInputHandler = (object, field) => {
    this.setState(object);
    this.setState({ [field]: "" });
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

  selectDropdownHandler = (event, data) => {
    if (data) {
      let name = data.subtag;
      let value = data.value;

      let i = this.state.tags;

      i[name] = value;

      this.setState({ tags: i });
    }
  };

  setPageNumber = input => {
    this.setState({ pageNumber: input });
    this.setState({ err: "" });
  };

  setErr = err => {
    this.setState({ err });
  };

  render() {
    return this.props.isSignedIn ? (
      <FormPage
        submitHandler={this.submitHandler}
        changeHandler={this.changeHandler}
        checkboxHandler={this.checkboxHandler}
        multiInputHandler={this.multiInputHandler}
        selectDropdownHandler={this.selectDropdownHandler}
        setPageNumber={this.setPageNumber}
        setErr={this.setErr}
        state={this.state}
      />
    ) : (
      <Redirect to="/" />
    );
  }
}

const mapStateToProps = state => {
  return {
    isSignedIn: state.auth.isSignedIn
  };
};

export default connect(mapStateToProps)(FormComponent);
