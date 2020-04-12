/* eslint no-eval: 0 */

import React from "react";

import COURSESLIST from "./settingsFiles/COURSELIST";
import LANGUAGELIST from "./settingsFiles/LANGUAGELIST";

const INPUT_TEKST = [
  {
    heading: "Tittel:",
    name: "title",
    placeholder: "Tittel",
    value: "this.props.state.title",
    validate: "this.props.state.titleErr"
  },
  {
    heading: "Forfatter:",
    name: "author",
    placeholder: "Navn",
    value: "this.props.state.author",
    validate: "this.props.state.authorErr"
  },
  {
    heading: "Oversatt av:",
    name: "translator",
    placeholder: "Navn",
    value: "this.props.state.translator"
  },
  {
    heading: "Lisens:",
    name: "license",
    placeholder: "Lisens",
    value: "this.props.state.license"
  }
];

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
          {INPUT_TEKST.map(element => (
            <div key={element.name} className="field">
              <label>
                <h3>{element.heading}</h3>
                <input
                  autoComplete="off"
                  type="text"
                  name={element.name}
                  placeholder={element.placeholder}
                  value={eval(element.value)}
                  onChange={this.props.myChangeHandler}
                />
              </label>
              {element.validate ? <div>{eval(element.validate)}</div> : null}
            </div>
          ))}
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
