import React, { useContext } from "react";
import { Input } from "semantic-ui-react";
import { LessonContext } from "contexts/LessonContext";
import { FORM_TEXT } from "../settingsFiles/languages/landingpage_NO";

const License = ({ changeHandler, license }) => {
  const context = useContext(LessonContext);
  const { data } = context;
  let licenseValue;
  try {
    licenseValue = data.ymlData.license;
  } catch (error) {
    console.log(error);
  }
  return (
    <div id="licenseField" className="field">
      <label>
        <h3 className="formLabel">{FORM_TEXT.LICENSE.heading}</h3>
        <Input
          autoComplete="off"
          type="text"
          name="license"
          placeholder={FORM_TEXT.LICENSE.placeholder}
          onChange={changeHandler}
          value={licenseValue}
        />
      </label>
    </div>
  );
};

export default License;
