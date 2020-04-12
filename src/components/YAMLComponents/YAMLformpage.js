import React from "react";

import COURSESLIST from "./settingsFiles/COURSELIST";
import LANGUAGELIST from "./settingsFiles/LANGUAGELIST";

const TITLE = { heading: "Tittel:", placeholder: "Tittel" };
const AUTHOR = { heading: "Forfatter:", placeholder: "Navn" };
const TRANSLATOR = {
  heading: "Oversatt av:",
  placeholder: "Navn"
};
const LICENSE = {
  heading: "Lisens:",
  placeholder: "Lisens"
};
const COURSE = { heading: "Kurs:", name: "course" };
const LANGUAGE = { heading: "Språk:", name: "language" };
const LEVEL = { heading: "Nivå:", name: "level" };

const LEVEL_VALUES = [
  { name: "Introduksjon", value: 1 },
  { name: "Nybegynner", value: 2 },
  { name: "Erfaren", value: 3 },
  { name: "Ekspert", value: 4 }
];

class YAMLformpage extends React.Component {
  render() {
    return (
      <div className="ui grid">
        <div className="eight wide column">
          <div className="field">
            <label>
              <h3>{TITLE.heading}</h3>
              <input
                autoComplete="off"
                type="text"
                name="title"
                placeholder={TITLE.placeholder}
                value={this.props.state.title}
                onChange={this.props.myChangeHandler}
              />
            </label>
            <div>{this.props.state.titleErr}</div>
          </div>
          <div className="field">
            <label>
              <h3>{AUTHOR.heading}</h3>
              <input
                autoComplete="off"
                type="text"
                name="author"
                placeholder={AUTHOR.placeholder}
                value={this.props.state.author}
                onChange={this.props.myChangeHandler}
              />
            </label>
            <div>{this.props.state.authorErr}</div>
          </div>
          <div className="field">
            <label>
              <h3>{TRANSLATOR.heading}</h3>
              <input
                autoComplete="off"
                type="text"
                name="translator"
                placeholder={TRANSLATOR.placeholder}
                value={this.props.state.translator}
                onChange={this.props.myChangeHandler}
              />
            </label>
          </div>
          <div className="field">
            <label>
              <h3>{LICENSE.heading}</h3>
              <input
                autoComplete="off"
                type="text"
                name="license"
                placeholder={LICENSE.placeholder}
                value={this.props.state.license}
                onChange={this.props.myChangeHandler}
              />
            </label>
          </div>
        </div>
        <div className="eight wide column">
          <div className="field">
            <label>
              <h3>{COURSE.heading}</h3>
              <select name={COURSE.name} onChange={this.props.myChangeHandler}>
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
              <h3>{LANGUAGE.heading}</h3>
              <select
                name={LANGUAGE.name}
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
              <h3>{LEVEL.heading}</h3>
              <select name={LEVEL.name} onChange={this.props.myChangeHandler}>
                {LEVEL_VALUES.map(element => (
                  <option key={element.value} value={element.value}>
                    {element.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>
    );
  }
}

export default YAMLformpage;
