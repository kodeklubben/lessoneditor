import React from "react";
import { Dropdown } from "semantic-ui-react";
import {
  levelOptions,
  FORM_TEXT,
} from "../settingsFiles/languages/landingpage_NO";

const Levels = ({ changeHandler, level }) => {
  return (
    <div>
      <h3 className="formLabel">{FORM_TEXT.LEVEL.heading}</h3>
      <Dropdown
        style={{ width: "13em" }}
        placeholder="Velg Nivå"
        name="level"
        // defaultValue={levelOptions[0].value}
        fluid
        selection
        onChange={changeHandler}
        options={levelOptions}
      />
    </div>
  );
};

export default Levels;
