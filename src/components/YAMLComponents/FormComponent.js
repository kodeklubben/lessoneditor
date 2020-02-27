import React from "react";
import FormPage from "./FormPage";

class FormComponent extends React.Component {
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

    //const for yml creation
    const fs = require("browserify-fs");
    //const for database
    const mongoose = require("mongoose");

    //Connection to database
    mongoose.connect(
      "mongodb+srv://oyvindjt:EYi6WQN9DfPat58@cluster0-psp4u.azure.mongodb.net/test?retryWrites=true&w=majority"
    );
    mongoose.connection.once("open", function() {
      console.log("connection has been made");
    });

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
