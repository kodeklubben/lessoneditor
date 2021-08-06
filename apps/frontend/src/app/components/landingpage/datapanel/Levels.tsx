import { Dropdown, Header } from "semantic-ui-react";
import { FORM_TEXT, levelOptions } from "../settingsFiles/languages/landingpage_NO";
import { FC } from "react";

const Levels: FC<any> = ({ changeHandler, data }) => {
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
