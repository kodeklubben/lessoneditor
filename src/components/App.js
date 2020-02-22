import "./App.css";
import React from "react";
import YAMLformPage from "./YAMLformpage";
import YMLfilePage from "./YMLfilePage";

const YAMLstateToString = state => {
  return (
    "---\ntitle: " +
    state.title +
    "\nauthor: " +
    state.author +
    "\ntranslator: " +
    state.translator +
    "\nlanguage: " +
    state.language +
    "\n---"
  );
};

const YMLstateToString = state => {
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

class App extends React.Component {
  onYAMLSubmitHandler = state => {
    console.log(YAMLstateToString(state));
    //ToDo: Send stateData to database via axios.
  };

  onYMLSubmitHandler = state => {
    console.log(YMLstateToString(state));
    //ToDo:  Get state-data from YAMLformpage an send it to database via axios.
  };

  render() {
    return (
      <div className="root container">
        {/* <YAMLformPage onSubmit={this.onYAMLSubmitHandler} /> */}
        <YMLfilePage onSubmit={this.onYMLSubmitHandler} />
      </div>
    );
  }
}

export default App;
