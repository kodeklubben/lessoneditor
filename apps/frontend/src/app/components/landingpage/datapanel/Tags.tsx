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
    <div style={{ display: "flex", flexFlow: "column", margin: "0 7em 0.2vh 0" }}>
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
    </div>
  );
};

const TagsGrade: FC<Tags> = ({ changeHandler, data }) => {
  return (
    <div
      style={{
        display: "flex",
        flexFlow: "row wrap",
        backgroundColor: "white",
        padding: "0.5em",
        border: "1px solid lightgrey",
        borderRadius: "5px",
      }}
    >
      <div>
        {gradeSettings.slice(0, gradeSettings.length / 2 + 1).map((element) => (
          <CheckboxWrapper
            key={element.value}
            name={element.name}
            subtag={element.subtag}
            data={data}
            value={element.value}
            onCheck={changeHandler}
          />
        ))}
      </div>

      <div>
        {gradeSettings.slice(gradeSettings.length / 2 + 1).map((element) => (
          <CheckboxWrapper
            key={element.value}
            name={element.name}
            subtag={element.subtag}
            data={data}
            value={element.value}
            onCheck={changeHandler}
          />
        ))}
      </div>
    </div>
  );
};

const TagsSubject: FC<Tags> = ({ changeHandler, data }) => {
  return (
    <div
      style={{
        display: "flex",
        flexFlow: "row wrap",
        backgroundColor: "white",
        padding: "0.5em",
        border: "1px solid lightgrey",
        borderRadius: "5px",
      }}
    >
      <div>
        {subjectSettings.slice(0, subjectSettings.length / 2 + 1).map((element) => (
          <CheckboxWrapper
            key={element.value}
            name={element.name}
            subtag={element.subtag}
            data={data}
            value={element.value}
            onCheck={changeHandler}
          />
        ))}
      </div>

      <div>
        {subjectSettings.slice(subjectSettings.length / 2 + 1).map((element, index) => (
          <CheckboxWrapper
            key={element.value}
            name={element.name}
            subtag={element.subtag}
            data={data}
            value={element.value}
            onCheck={changeHandler}
          />
        ))}
      </div>
    </div>
  );
};

const TagsTopic: FC<Tags> = ({ changeHandler, data }) => {
  return (
    <div
      style={{
        display: "flex",
        flexFlow: "row wrap",
        backgroundColor: "white",
        padding: "0.5em",
        border: "1px solid lightgrey",
        borderRadius: "5px",
      }}
    >
      <div>
        {topicSettings.slice(0, topicSettings.length / 2 + 1).map((element, index) => (
          <CheckboxWrapper
            key={element.value}
            name={element.name}
            subtag={element.subtag}
            data={data}
            value={element.value}
            onCheck={changeHandler}
          />
        ))}
      </div>

      <div>
        {topicSettings.slice(topicSettings.length / 2 + 1).map((element, index) => (
          <CheckboxWrapper
            key={element.value}
            name={element.name}
            subtag={element.subtag}
            data={data}
            value={element.value}
            onCheck={changeHandler}
          />
        ))}
      </div>
    </div>
  );
};

export { TagsGrade, TagsSubject, TagsTopic };
