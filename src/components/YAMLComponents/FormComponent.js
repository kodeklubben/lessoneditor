import React from "react";
import FormPage from "./FormPage";
import COURSELIST from "./settingsFiles/COURSELIST";
import LANGUAGELIST from "./settingsFiles/LANGUAGELIST";

const INIT_PROPS = {
  course: COURSELIST[0].courseTitle,
  title: "",
  titleErr: "",
  author: "",
  authorErr: "",
  translator: "",
  language: LANGUAGELIST[0].language[0],
  level: 1,
  license: "",
  tags: { topic: [], subject: [], grade: [] }
};

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
      language: LANGUAGELIST[0].language[0],
      level: 1,
      license: "",
      tags: { topic: [], subject: [], grade: [] },
      redirect: null
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

  myChangeHandler = event => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
  };

  validate = () => {
    let titleErr = "";
    let authorErr = "";

    if (!this.state.title) {
      titleErr = "Må skrive inn tittel";
    }
    if (!this.state.author) {
      authorErr = "Må skrive inn forfatter";
    }

    if (titleErr || authorErr) {
      this.setState({ titleErr, authorErr });
      return false;
    }

    return true;
  };

  mySubmitHandler = event => {
    event.preventDefault();
    let notErr = this.validate();

    if (notErr) {
      this.setState({ redirect: "/editor" });

      //const for yml creation
      const fs = require("browserify-fs");

      //create yml file
      fs.writeFile("lesson.yml", this.YMLstateToString(this.state), function(
        err
      ) {
        if (err) throw err;
      });

      console.log("saved yml-file");
      console.log("YAML header: \n" + this.YAMLstateToString(this.state));
      console.log("\nYML-file: \n" + this.YMLstateToString(this.state));
      // TODO: Send state-data to database
    }
  };

  myCheckboxHandler = event => {
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

  render() {
    return (
      <div className="FromComponent">
        <FormPage
          mySubmitHandler={this.mySubmitHandler}
          myChangeHandler={this.myChangeHandler}
          myCheckboxHandler={this.myCheckboxHandler}
          state={this.state}
        />
      </div>
    );
  }
}

export default FormComponent;
