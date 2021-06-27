import React from "react";
import { Dropdown, Header } from "semantic-ui-react";
import {
  levelOptions,
  FORM_TEXT,
} from "../settingsFiles/languages/landingpage_NO";

const Levels = ({ changeHandler, data }) => {
  return (
    <>
      <Header as="h3">{FORM_TEXT.LEVEL.heading}</Header>
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
