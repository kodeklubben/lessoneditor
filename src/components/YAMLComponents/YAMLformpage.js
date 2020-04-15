import React from "react";

import COURSESLIST from "./settingsFiles/COURSELIST";
import { LANGUAGES, FORM_TEXT } from "./settingsFiles/languages/formpage_NO";

class YAMLformpage extends React.Component {
  render() {
    return (
      <div className="ui two column grid">
        <div className="column">
          <div className="">
            <label>
              <h3>{FORM_TEXT.TITLE.heading}</h3>
              <input
                autoComplete="off"
                type="text"
                name="title"
                placeholder={FORM_TEXT.TITLE.placeholder}
                value={this.props.state.title}
                onChange={this.props.myChangeHandler}
              />
            </label>
            <div style={{ color: "red" }}>{this.props.state.titleErr}</div>
          </div>
          <div className="">
            <label>
              <h3>{FORM_TEXT.AUTHOR.heading}</h3>
              <input
                autoComplete="off"
                type="text"
                name="author"
                placeholder={FORM_TEXT.AUTHOR.placeholder}
                value={this.props.state.author}
                onChange={this.props.myChangeHandler}
              />
            </label>
            <div style={{ color: "red" }}>{this.props.state.authorErr}</div>
          </div>
          <div className="">
            <label>
              <h3>{FORM_TEXT.TRANSLATOR.heading}</h3>
              <input
                autoComplete="off"
                type="text"
                name="translator"
                placeholder={FORM_TEXT.TRANSLATOR.placeholder}
                value={this.props.state.translator}
                onChange={this.props.myChangeHandler}
              />
            </label>
          </div>
          <div className="">
            <label>
              <h3>{FORM_TEXT.LICENSE.heading}</h3>
              <input
                autoComplete="off"
                type="text"
                name="license"
                placeholder={FORM_TEXT.LICENSE.placeholder}
                value={this.props.state.license}
                onChange={this.props.myChangeHandler}
              />
            </label>
          </div>
        </div>
        <div className="column">
          <div className="">
            <label>
              <h3>{FORM_TEXT.COURSE.heading}</h3>
              <select name="course" onChange={this.props.myChangeHandler}>
                {COURSESLIST.map(element => (
                  <option key={element.courseTitle} value={element.courseTitle}>
                    {element.courseTitle}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="">
            <label>
              <h3>{FORM_TEXT.LANGUAGE.heading}</h3>
              <select name="language" onChange={this.props.myChangeHandler}>
                {LANGUAGES.map(element => (
                  <option
                    key={Object.keys(element)}
                    value={Object.keys(element)}
                  >
                    {Object.values(element)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="">
            <label>
              <h3>{FORM_TEXT.LEVEL.heading}</h3>
              <select name="level" onChange={this.props.myChangeHandler}>
                {FORM_TEXT.LEVEL_VALUES.map(element => (
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
