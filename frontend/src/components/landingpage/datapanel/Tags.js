import React from "react";
import {
  gradeSettings,
  subjectSettings,
  topicSettings,
} from "../settingsFiles/LESSONTAGSSETTINGS";

const Checkbox = ({ value, onCheck, data, name, subtag }) => {
  const onInputChange = (event) => {
    onCheck(event);
  };

  // console.log("name : " + value);

  return (
    <div className="ui checkbox">
      <input
        type="checkbox"
        checked={data[value]}
        name={name}
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

const TagsGrade = ({ changeHandler, data }) => {
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

const TagsSubject = ({ changeHandler, data }) => {
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

const TagsTopic = ({ changeHandler, data }) => {
  return (
    <>
      {topicSettings.map((element, index) => (
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

export { TagsGrade, TagsSubject, TagsTopic };
