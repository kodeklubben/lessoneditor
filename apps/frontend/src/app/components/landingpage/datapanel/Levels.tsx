import "./levels.scss";
import { Dropdown } from "semantic-ui-react";
import { FORM_TEXT, levelOptions } from "../settingsFiles/languages/landingpage_NO";
import { FC, SyntheticEvent } from "react";
import { YamlContent } from "@lessoneditor/contracts";

interface LevelsProps {
  changeHandler: (e: SyntheticEvent, data: Record<string, string>) => void;
  data: YamlContent;
}

const Levels: FC<LevelsProps> = ({ changeHandler, data }) => {
  return (
    <div className="levels">
      <h3>{FORM_TEXT.LEVEL.heading}</h3>
      <Dropdown
        placeholder="Velg Nivå"
        name="level"
        value={data.level}
        // defaultValue={1}
        fluid
        selection
        onChange={changeHandler}
        options={levelOptions}
        label={FORM_TEXT.LEVEL.heading}
      />
    </div>
  );
};

export default Levels;
