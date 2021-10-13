import { Dropdown, Header } from "semantic-ui-react";
import { FORM_TEXT, levelOptions } from "../settingsFiles/languages/landingpage_NO";
import { FC, SyntheticEvent } from "react";
import { YamlContent } from "@libs/lesson/src/lib/lesson.dto";

interface LevelsProps {
  changeHandler: (e: SyntheticEvent, data: Record<string, string>) => void;
  data: YamlContent;
}

const Levels: FC<LevelsProps> = ({ changeHandler, data }) => {
  return (
    <>
      <Header as="h3">{FORM_TEXT.LEVEL.heading}</Header>
      <Dropdown
        placeholder="Velg Nivå"
        name="level"
        value={data.level}
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
