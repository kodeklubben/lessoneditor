import React from "react";
import ReactDOM from "react-dom";

class Yarnformpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      course: "Micro:it",
      title: "",
      writer: "",
      translator: "",
      language: ""
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
      <form>
        <select value={this.state.course}>
          Kurs:
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

        <input type="text" name="title" onChange={this.myChangeHandler}>
          Tittel:
        </input>

        <input type="text" name="writer" onChange={this.myChangeHandler}>
          Forfatter:
        </input>
        <input type="text" name="translator" onChange={this.myChangeHandler}>
          Oversatt av:
        </input>

        <select value={this.state.language}>
          Språk:
          <option value="Norsk">Norsk</option>
          <option value="Nynorsk">Nynorsk</option>
          <option value="Engelsk">Engelsk</option>
          <option value="Islandsk">Islandsk</option>
        </select>

        <input type="submit"> Neste </input>
      </form>
    );
  }
}

export default Yarnformpage;
