import React from "react";
import MultiInput from "./MultiInput";

import { LANGUAGES, FORM_TEXT } from "./settingsFiles/languages/formpage_NO";

const Page1 = props => {
  return (
    <React.Fragment>
      <form className="ui form">
        {/* <div className="field">
          <label>
            <h3 className="formLabel">
              {FORM_TEXT.AUTHOR.heading}
              <span className="requiredText"> (obligatorisk)</span>
            </h3>
            <input
              autoFocus
              autoComplete="off"
              type="text"
              name="author"
              placeholder={FORM_TEXT.AUTHOR.placeholder}
              value={props.state.author}
              onChange={props.changeHandler}
            />
          </label>
          <div className="validateError">{props.state.authorErr}</div>
        </div> */}
        <MultiInput
          changeHandler={props.changeHandler}
          multiInputHandler={props.multiInputHandler}
          name="author"
          title={FORM_TEXT.AUTHOR.heading}
          inputArray={props.state.authorList}
          inputValue={props.state.author}
          validateMessage={props.state.err}
          autofocus="autofocus"
          required="(obligatorisk)"
          placeholder={FORM_TEXT.AUTHOR.placeholder}
        />
        {/* <div className="field">
          <label>
            <h3 className="formLabel">{FORM_TEXT.TRANSLATOR.heading}</h3>
            <input
              autoComplete="off"
              type="text"
              name="translator"
              placeholder={FORM_TEXT.TRANSLATOR.placeholder}
              value={props.state.translator}
              onChange={props.changeHandler}
            />
          </label>
        </div> */}
        <MultiInput
          changeHandler={props.changeHandler}
          multiInputHandler={props.multiInputHandler}
          name="translator"
          title={FORM_TEXT.TRANSLATOR.heading}
          inputArray={props.state.translatorList}
          inputValue={props.state.translator}
          placeholder={FORM_TEXT.TRANSLATOR.placeholder}
        />
        <div className="field">
          <label>
            <h3 className="formLabel">{FORM_TEXT.LANGUAGE.heading}</h3>
            <select
              name="language"
              onChange={props.changeHandler}
              className="ui dropdown"
            >
              {LANGUAGES.map(element => (
                <option key={Object.keys(element)} value={Object.keys(element)}>
                  {Object.values(element)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div id="licenseField" className="field">
          <label>
            <h3 className="formLabel">{FORM_TEXT.LICENSE.heading}</h3>
            <input
              autoComplete="off"
              type="text"
              name="license"
              placeholder={FORM_TEXT.LICENSE.placeholder}
              // value={props.state.license}
              onChange={props.changeHandler}
            />
          </label>
        </div>
      </form>
    </React.Fragment>
  );
};

export default Page1;
