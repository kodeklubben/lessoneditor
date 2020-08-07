import React from "react";
import { Input } from "semantic-ui-react";

import { FORM_TEXT } from "../settingsFiles/languages/landingpage_NO";

const Levels = ({ changeHandler }) => {
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
        />
      </label>
    </div>
  );
};

export default Levels;
