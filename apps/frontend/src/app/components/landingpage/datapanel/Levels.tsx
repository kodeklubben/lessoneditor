import { Dropdown, Header } from "semantic-ui-react";
import { FORM_TEXT, levelOptions } from "../settingsFiles/languages/landingpage_NO";
import { FC, SyntheticEvent } from "react";

interface Subtag {
  grade: string[];
  subject: string[];
  topic: string[];
}

interface YmlData {
  level: number;
  license: string;
  tags: Subtag;
}

interface LevelsProps {
  changeHandler: (e: SyntheticEvent, data: Record<string, string>) => void;
  data: YmlData;
}

const Levels: FC<LevelsProps> = ({ changeHandler, data }) => {
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
