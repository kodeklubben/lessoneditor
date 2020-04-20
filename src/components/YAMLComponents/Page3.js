import React from "react";

import { YMLtagsSubject, YMLtagsTopic } from "./YMLtags";
import { YML_TEXT } from "./settingsFiles/languages/formpage_NO";

import { FORM_TEXT } from "./settingsFiles/languages/formpage_NO";

import PageButtons from "../PageButtons";
import { NAV_BUTTONS } from "./settingsFiles/languages/formpage_NO";

const Page3 = props => {
  return (
    <div className="">
      <div className="field">
        <label>
          <h3>
            {FORM_TEXT.TITLE.heading}
            <inline className="test"> (nødvendig)</inline>
          </h3>
          <input
            autoComplete="off"
            type="text"
            name="title"
            placeholder={FORM_TEXT.TITLE.placeholder}
            value={props.state.title}
            onChange={props.changeHandler}
          />
        </label>
        <div className="validateError">{props.state.titleErr}</div>
      </div>
      <div className="field">
        <div className="ui two column grid">
          <div className="column">
            <h3>{YML_TEXT.subject}</h3>
            <YMLtagsSubject checkboxHandler={props.checkboxHandler} />
          </div>
          <div className="column">
            <h3>{YML_TEXT.topic}</h3>
            <YMLtagsTopic checkboxHandler={props.checkboxHandler} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page3;
