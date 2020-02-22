import "./App.css";
import React from "react";
import YAMLformPage from "./YAMLformpage";
import YMLfilePage from "./YMLfilePage";

const YAMLtoString = state => {
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

class App extends React.Component {
  onYAMLSubmitHandler = state => {
    console.log(YAMLtoString(state));
    //ToDo: Send stateData to database via axios.
  };

  onYMLSubmitHandler = state => {
    //ToDo:  Get state-data from YAMLformpage an send it to database via axios.
    console.log(state);
  };

  render() {
    return (
      <div className="root container">
        <YAMLformPage onSubmit={this.onYAMLSubmitHandler} />
        {/* <YMLfilePage onSubmit={this.onYMLSubmitHandler} /> */}
      </div>
    );
  }
}

export default App;
