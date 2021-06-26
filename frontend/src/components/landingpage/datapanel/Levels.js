import React from "react";
import { Dropdown } from "semantic-ui-react";
import {
  levelOptions,
  FORM_TEXT,
} from "../settingsFiles/languages/landingpage_NO";

const Levels = ({ changeHandler, data }) => {
  return (
    <>
      <h3 className="formLabel">{FORM_TEXT.LEVEL.heading}</h3>
      <Dropdown
        placeholder="Velg Nivå"
        name="level"
        defaultValue={levelOptions[0].value}
        value={data["level"]}
        fluid
        selection
        onChange={changeHandler}
        options={levelOptions}
        label={FORM_TEXT.LEVEL.heading}
      />
    </>
  );
};

export default Levels;
