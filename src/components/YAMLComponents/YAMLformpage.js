import React from "react";

const dropdownHeight = 32;

class YAMLformpage extends React.Component {
  render() {
    return (
      <div className="ui grid">
        <div className="eight wide column">
          <div className="field">
            <label>
              <h3>Tittel:</h3>
              <input
                type="text"
                name="title"
                placeholder="Tittel"
                value={this.props.state.title}
                onChange={this.props.myChangeHandler}
              />
            </label>
          </div>
          <div className="field">
            <label>
              <h3>Forfatter:</h3>
              <input
                type="text"
                name="author"
                placeholder="Navn"
                value={this.props.state.author}
                onChange={this.props.myChangeHandler}
              />
            </label>
          </div>
          <div className="field">
            <label>
              <h3>Oversatt av:</h3>
              <input
                type="text"
                name="translator"
                placeholder="Navn"
                value={this.props.state.translator}
                onChange={this.props.myChangeHandler}
              />
            </label>
          </div>
          <div className="field">
            <label>
              <h3>Lisens:</h3>
              <input
                type="text"
                name="license"
                placeholder="Lisens"
                value={this.props.state.license}
                onChange={this.props.myChangeHandler}
              />
            </label>
          </div>
        </div>
        <div className="eight wide column">
          <div className="field">
            <label>
              <h3>Kurs:</h3>
              <select
                style={{ height: dropdownHeight }}
                name="course"
                onChange={this.props.myChangeHandler}
              >
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
              <h3>Språk:</h3>
              <select
                style={{ height: dropdownHeight }}
                name="language"
                onChange={this.props.myChangeHandler}
              >
                <option value="nb">Bokmål</option>
                <option value="nn">Nynorsk</option>
                <option value="en">Engelsk</option>
                <option value="is">Islandsk</option>
                {/* <option value="sv">Svensk</option>
                <option value="da">Dansk</option>
                <option value="hr">Kroatisk</option> */}
              </select>
            </label>
          </div>
          <div className="field">
            <label>
              <h3>Nivå:</h3>
              <select
                style={{ height: dropdownHeight }}
                name="level"
                onChange={this.props.myChangeHandler}
              >
                <option value={1}>Introduksjon</option>
                <option value={2}>Nybegynner</option>
                <option value={3}>Erfaren</option>
                <option value={4}>Ekspert</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    );
  }
}

export default YAMLformpage;
