import React from "react";
import MultiInput from "./MultiInput";

import { LANGUAGES, FORM_TEXT } from "./settingsFiles/languages/formpage_NO";

const Page1 = props => {
  return (
    <>
      <form className="ui form">
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
              onChange={props.changeHandler}
            />
          </label>
        </div>
      </form>
    </>
  );
};

export default Page1;
