import { FC, SyntheticEvent } from "react";
import { Checkbox } from "semantic-ui-react";
import { gradeSettings, subjectSettings, topicSettings } from "../settingsFiles/LESSONTAGSSETTINGS";

interface CheckboxWrapperProps {
  name: string;
  subtag: string;
  data: Record<string, boolean>;
  value: string;
  onCheck: (e: SyntheticEvent, data: Record<string, string>) => void;
}

interface Tags {
  changeHandler: (e: SyntheticEvent, data: Record<string, string>) => void;
  data: Record<string, boolean>;
}

const CheckboxWrapper: FC<CheckboxWrapperProps> = ({ value, onCheck, data, name, subtag }) => {
  return (
    <>
      <Checkbox
        label={name}
        type="checkbox"
        checked={data[value]}
        name={name}
        subtag={subtag}
        id={value}
        value={value}
        onChange={onCheck}
      />
    </>
  );
};

const TagsGrade: FC<Tags> = ({ changeHandler, data }) => {
  return (
    <>
      {gradeSettings.map((element, index) => (
        <div className="column" key={"element" + index}>
          <CheckboxWrapper
            name={element.name}
            subtag={element.subtag}
            data={data}
            value={element.value}
            onCheck={changeHandler}
          />
        </div>
      ))}
    </>
  );
};

const TagsSubject: FC<Tags> = ({ changeHandler, data }) => {
  return (
    <>
      {subjectSettings.map((element, index) => (
        <div className="column" key={"element" + index}>
          <CheckboxWrapper
            name={element.name}
            subtag={element.subtag}
            data={data}
            value={element.value}
            onCheck={changeHandler}
          />
        </div>
      ))}
    </>
  );
};

const TagsTopic: FC<Tags> = ({ changeHandler, data }) => {
  return (
    <>
      {topicSettings.map((element, index) => (
        <div className="column" key={"element-" + index}>
          <CheckboxWrapper
            name={element.name}
            subtag={element.subtag}
            data={data}
            value={element.value}
            onCheck={changeHandler}
          />
        </div>
      ))}
    </>
  );
};

export { TagsGrade, TagsSubject, TagsTopic };
