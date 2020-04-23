import React from "react";

import { YMLtagsSubject, YMLtagsTopic } from "./YMLtags";
import { YML_TEXT } from "./settingsFiles/languages/formpage_NO";

import { FORM_TEXT } from "./settingsFiles/languages/formpage_NO";

import PageButtons from "../PageButtons";
import { NAV_BUTTONS } from "./settingsFiles/languages/formpage_NO";

const Page3 = props => {
  return (
    <div className="">
      <div className="ui grid">
        <div className="sixteen wide column">
          <div className="field">
            <label>
              <h3>
                {FORM_TEXT.TITLE.heading}
                <span className="test"> (nødvendig)</span>
              </h3>
            </label>
            <input
              autoFocus
              autoComplete="off"
              type="text"
              name="title"
              placeholder={FORM_TEXT.TITLE.placeholder}
              value={props.state.title}
              onChange={props.changeHandler}
            />
          </div>
        </div>
        <div className="validateError">{props.state.titleErr}</div>
      </div>

      <div className="ui grid">
        <div className="eight wide column">
          <div className="field">
            <label>
              <h3>{YML_TEXT.subject}</h3>
            </label>
            <div className="ui segment">
              <div className="ui stackable two column grid">
                <YMLtagsSubject checkboxHandler={props.checkboxHandler} />
              </div>
            </div>
          </div>
        </div>
        <div className="eight wide column">
          <div className="field">
            <label>
              <h3>{YML_TEXT.topic}</h3>
            </label>
            <div className="ui segment">
              <div className="ui stackable two column grid">
                <YMLtagsTopic checkboxHandler={props.checkboxHandler} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page3;
