import React from "react";

class YAMLformpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      course: "Micro:it",
      title: "",
      author: "",
      translator: "",
      language: "nb"
    };
  }
  myChangeHandler = event => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
  };
  mySubmitHandler = event => {
    event.preventDefault();
    this.props.onSubmit(this.state);
  };

  render() {
    return (
      <div className="ui container">
        <form className="ui big form" onSubmit={this.mySubmitHandler}>
          <div className="field">
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
          </div>
          <div className="field">
            <label>
              Tittel:
              <input
                type="text"
                name="title"
                placeholder="Tittel"
                value={this.state.title}
                onChange={this.myChangeHandler}
              />
            </label>
          </div>
          <div className="field">
            <label>
              Forfatter:
              <input
                type="text"
                name="author"
                placeholder="Navn"
                value={this.state.author}
                onChange={this.myChangeHandler}
              />
            </label>
          </div>
          <div className="field">
            <label>
              Oversatt av:
              <input
                type="text"
                name="translator"
                placeholder="Navn"
                value={this.state.translator}
                onChange={this.myChangeHandler}
              />
            </label>
          </div>
          <div className="field">
            <label>
              Språk:
              <select name="language" onChange={this.myChangeHandler}>
                <option value="nb">Norsk</option>
                <option value="nn">Nynorsk</option>
                <option value="en">Engelsk</option>
                <option value="is">Islandsk</option>
                {/* <option value="sv">Svensk</option>
                <option value="da">Dansk</option>
                <option value="hr">Kroatisk</option> */}
              </select>
            </label>
          </div>
          <button className="ui icon left labeled black button" type="button">
            <i aria-hidden="true" className="left arrow icon"></i>
            Tilbake
          </button>
          <button
            className="ui icon right labeled button toRight"
            type="button"
            onClick={this.mySubmitHandler}
          >
            Neste
            <i aria-hidden="true" className="right arrow icon"></i>
          </button>
        </form>
      </div>
    );
  }
}

export default YAMLformpage;
