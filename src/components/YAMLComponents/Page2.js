import React from "react";

import { YMLtagsGrade } from "./YMLtags";
import { YML_TEXT } from "./settingsFiles/languages/formpage_NO";

import COURSESLIST from "./settingsFiles/COURSELIST";
import { FORM_TEXT } from "./settingsFiles/languages/formpage_NO";

import PageButtons from "../PageButtons";
import { NAV_BUTTONS } from "./settingsFiles/languages/formpage_NO";

const Page2 = props => {
  return (
    <div className="">
      <div className="">
        <label>
          <h3>{FORM_TEXT.COURSE.heading}</h3>
          <select name="course" onChange={props.changeHandler}>
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
          <h3>{FORM_TEXT.LEVEL.heading}</h3>
          <select name="level" onChange={props.changeHandler}>
            {FORM_TEXT.LEVEL_VALUES.map(element => (
              <option key={element.value} value={element.value}>
                {element.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <h3>{YML_TEXT.grade}</h3>
        <YMLtagsGrade checkboxHandler={props.checkboxHandler} />
      </div>
    </div>
  );
};

export default Page2;
