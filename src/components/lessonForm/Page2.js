import React from "react";

import { YMLtagsGrade } from "./YMLtags";
import { YML_TEXT } from "./settingsFiles/languages/formpage_NO";

import COURSESLIST from "./settingsFiles/COURSELIST";
import { FORM_TEXT } from "./settingsFiles/languages/formpage_NO";

const Page2 = props => {
  return (
    <div className="">
      <div className="field">
        <label>
          <h3>{FORM_TEXT.COURSE.heading}</h3>
          <select
            className="ui dropdown"
            name="course"
            onChange={props.changeHandler}
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
          <h3>{FORM_TEXT.LEVEL.heading}</h3>
          <select
            className="ui dropdown"
            name="level"
            onChange={props.changeHandler}
          >
            {FORM_TEXT.LEVEL_VALUES.map(element => (
              <option key={element.value} value={element.value}>
                {element.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="ui grid">
        <div className="eight wide column">
          <div className="field">
            <label>
              <h3 className="">{YML_TEXT.grade}</h3>
            </label>
            <div className="ui segment">
              <div className="ui stackable two column grid">
                <YMLtagsGrade checkboxHandler={props.checkboxHandler} />
              </div>
            </div>
          </div>
        </div>
        <div className="eight wide column"></div>
      </div>
    </div>
  );
};

export default Page2;
