import { FC } from "react";
// @ts-ignore
import { gradeSettings } from "../settingsFiles/LESSONTAGSSETTINGS";
// @ts-ignore
import { subjectSettings } from "../settingsFiles/LESSONTAGSSETTINGS";
// @ts-ignore
import { topicSettings } from "../settingsFiles/LESSONTAGSSETTINGS";

const Checkbox: FC<any> = ({ value, onCheck, data, name, subtag }) => {
  const onInputChange = (event: any) => {
    onCheck(event);
  };

  return (
    <div className="ui checkbox">
      <input
        type="checkbox"
        checked={data[value]}
        name={name}
        //@ts-expect-error
        subtag={subtag}
        id={value}
        value={value}
        onChange={onInputChange}
      />
      <label style={{ cursor: "pointer" }} htmlFor={value}>
        {name}
      </label>
    </div>
  );
};

const TagsGrade: FC<any> = ({ changeHandler, data }) => {
  return (
    <>
      {gradeSettings.map((element, index) => (
        <div className="column" key={"element" + index}>
          <Checkbox
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

const TagsSubject: FC<any> = ({ changeHandler, data }) => {
  return (
    <>
      {subjectSettings.map((element, index) => (
        <div className="column" key={"element" + index}>
          <Checkbox
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

const TagsTopic: FC<any> = ({ changeHandler, data }) => {
  return (
    <>
      {topicSettings.map((element, index) => (
        <div className="column" key={"element-" + index}>
          <Checkbox
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
