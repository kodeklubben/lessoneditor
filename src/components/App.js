import "./App.css";
import React from "react";
import FormPage from "./YAMLComponents/FormPage";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      course: "Micro:it",
      title: "",
      author: "",
      translator: "",
      language: "nb",
      level: 1,
      license: "",
      tags: { topic: [], subject: [], grade: [] }
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

  mySubmitHandler = event => {
    event.preventDefault();

    console.log("YAML header: \n" + this.YAMLstateToString(this.state));
    console.log("\nYML-file: \n" + this.YMLstateToString(this.state));

    // TODO: Send state-data to database
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
      <div className="root container">
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

export default App;
