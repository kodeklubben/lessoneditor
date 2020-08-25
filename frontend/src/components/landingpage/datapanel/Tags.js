import React from "react";
import {
  gradeSettings,
  subjectSettings,
  topicSettings,
} from "../settingsFiles/LESSONTAGSSETTINGS";

const Checkbox = ({ value, onCheck, data, name }) => {
  const onInputChange = (event) => {
    onCheck(event);
  };

  return (
    <div className="ui checkbox">
      <input
        type="checkbox"
        checked={data?.yml[value]}
        name={name}
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

const TagsGrade = ({ changeHandler, data }) => {
  return (
    <>
      {gradeSettings.map((element, index) => (
        <div className="column" key={"element" + index}>
          <Checkbox
            name={element.name}
            data={data}
            value={element.value}
            onCheck={changeHandler}
          />
        </div>
      ))}
    </>
  );
};

const TagsSubject = ({ changeHandler, data }) => {
  return (
    <>
      {subjectSettings.map((element, index) => (
        <div className="column" key={"element" + index}>
          <Checkbox
            name={element.name}
            data={data}
            value={element.value}
            onCheck={changeHandler}
          />
        </div>
      ))}
    </>
  );
};

const TagsTopic = ({ changeHandler, data }) => {
  return (
    <>
      {topicSettings.map((element, index) => (
        <div className="column" key={"element" + index}>
          <Checkbox
            name={element.name}
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
