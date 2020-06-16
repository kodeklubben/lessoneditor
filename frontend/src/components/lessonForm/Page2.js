import React from "react";

import { YMLtagsGrade } from "./YMLtags";
import { YML_TEXT } from "./settingsFiles/languages/formpage_NO";

import COURSESLIST from "./settingsFiles/COURSELIST";
import { FORM_TEXT } from "./settingsFiles/languages/formpage_NO";

const Page2 = (props) => {
  return (
    <>
      <form className="ui form">
        <div className="field">
          <label>
            <h3 className="formLabel">{FORM_TEXT.COURSE.heading}</h3>
            <select
              className="ui dropdown"
              name="course"
              onChange={props.changeHandler}
            >
              {COURSESLIST.map((element) => (
                <option key={element.courseTitle} value={element.courseTitle}>
                  {element.courseTitle}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="field">
          <label>
            <h3 className="formLabel">{FORM_TEXT.LEVEL.heading}</h3>
            <select
              className="ui dropdown"
              name="level"
              onChange={props.changeHandler}
            >
              {FORM_TEXT.LEVEL_VALUES.map((element) => (
                <option key={element.value} value={element.value}>
                  {element.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="two fields">
          <div className="field">
            <label>
              <h3 className="formLabel">{YML_TEXT.grade}</h3>
            </label>
            <div
              id="levelCheckbox"
              style={{ marginTop: "0px" }}
              className="ui segment"
            >
              <div className="ui grid">
                <div className="stackable column">
                  <YMLtagsGrade checkboxHandler={props.checkboxHandler} />
                </div>
              </div>
            </div>
          </div>
          <div className="field" />
        </div>
      </form>
    </>
  );
};

export default Page2;
