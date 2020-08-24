import React from "react";
import {
  gradeSettings,
  subjectSettings,
  topicSettings,
} from "../settingsFiles/LESSONTAGSSETTINGS";

const Checkbox = ({ value, onCheck, subtag, name }) => {
  const onInputChange = (event) => {
    onCheck(event);
  };

  return (
    <div className="ui checkbox">
      <input
        type="checkbox"
        name={subtag}
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

const TagsGrade = ({ checkboxHandler }) => {
  return (
    <>
      {gradeSettings.map((element, index) => (
        <div className="column" key={"element" + index}>
          <Checkbox
            name={element.name}
            value={element.value}
            subtag={element.subtag}
            onCheck={checkboxHandler}
          />
        </div>
      ))}
    </>
  );
};

const TagsSubject = ({ checkboxHandler }) => {
  return (
    <>
      {subjectSettings.map((element, index) => (
        <div className="column" key={"element" + index}>
          <Checkbox
            name={element.name}
            value={element.value}
            subtag={element.subtag}
            onCheck={checkboxHandler}
          />
        </div>
      ))}
    </>
  );
};

const TagsTopic = ({ checkboxHandler, data }) => {
  console.log(data);
  return (
    <>
      {topicSettings.map((element, index) => (
        <div className="column" key={"element" + index}>
          <Checkbox
            name={element.name}
            value={element.value}
            subtag={element.subtag}
            checked={data}
            onCheck={checkboxHandler}
          />
        </div>
      ))}
    </>
  );
};

export { TagsGrade, TagsSubject, TagsTopic };
