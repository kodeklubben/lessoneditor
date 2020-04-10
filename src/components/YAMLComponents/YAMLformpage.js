import React from "react";

import COURSESLIST from "./settingsFiles/COURSELIST";
import LANGUAGELIST from "./settingsFiles/LANGUAGELIST";

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
                autoComplete="off"
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
                autoComplete="off"
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
                autoComplete="off"
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
                autoComplete="off"
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
                {COURSESLIST.map(element => (
                  <option key={element.courseTitle} value={element.courseTitle}>
                    {element.courseTitle}
                  </option>
                ))}
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
                {LANGUAGELIST.map(element => (
                  <option key={element.language[0]} value={element.language[0]}>
                    {element.language[1]}
                  </option>
                ))}
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
