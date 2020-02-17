import React from "react";
import ReactDOM from "react-dom";

class Yarnformpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      course: "",
      title: "",
      writer: "",
      translator: "",
      language: "Norsk"
    };
  }
  myChangeHandler = event => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
  };
  mySubmitHandler = event => {
    event.preventDefault();
  };
  render() {
    return (
      <form onSubmit={this.mySubmitHandler}>
        <label>
          Tema:
          <select name="course" onChange={this.myChangeHandler}>
            <option value="Micro:it">Micro:it</option>
            <option value="Scratch">Scratch</option>
            <option value="Python">Python</option>
            <option value="Lego Mindstorms">Lego Mindstorms</option>
            <option value="Web">Web</option>
            <option value="Code Studio">Code Studio</option>
            <option value="Processing">Processing</option>
            <option value="Elm">Elm</option>
            <option value="Computer Craft">Computer Craft</option>
            <option value="App Inventor">App Inventor</option>
            <option value="Arduino">Arduino</option>
          </select>
        </label>

        <label>
          Tittel:
          <input type="text" name="title" onChange={this.myChangeHandler} />
        </label>

        <label>
          Forfatter:{" "}
          <input type="text" name="writer" onChange={this.myChangeHandler} />
        </label>
        <label>
          Oversatt av:
          <input
            type="text"
            name="translator"
            onChange={this.myChangeHandler}
          />
        </label>
        <label>
          Språk:
          <select name="language" onChange={this.myChangeHandler}>
            <option value="Norsk">Norsk</option>
            <option value="Nynorsk">Nynorsk</option>
            <option value="Engelsk">Engelsk</option>
            <option value="Islandsk">Islandsk</option>
          </select>
        </label>
        <input type="submit" />
      </form>
    );
  }
}

export default Yarnformpage;
