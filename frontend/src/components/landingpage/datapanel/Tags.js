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
    <div style={{ display: "flex" }} className="ui checkbox">
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
      <div style={{ float: "right" }}>
        <i
          style={{ justifyContent: "flex-end", float: "right" }}
          className="info circle icon"
        />
      </div>
    </div>
  );
};

const TagsGrade = (props) => {
  return (
    <>
      {gradeSettings.map((element, index) => (
        <div className="column" key={"element" + index}>
          <Checkbox
            name={element.name}
            value={element.value}
            subtag={element.subtag}
            onCheck={props.checkboxHandler}
          />
        </div>
      ))}
    </>
  );
};

const TagsSubject = (props) => {
  return (
    <>
      {subjectSettings.map((element, index) => (
        <div className="column" key={"element" + index}>
          <Checkbox
            name={element.name}
            value={element.value}
            subtag={element.subtag}
            onCheck={props.checkboxHandler}
          />
        </div>
      ))}
    </>
  );
};

const TagsTopic = (props) => {
  return (
    <>
      {topicSettings.map((element, index) => (
        <div className="column" key={"element" + index}>
          <Checkbox
            name={element.name}
            value={element.value}
            subtag={element.subtag}
            onCheck={props.checkboxHandler}
          />
        </div>
      ))}
    </>
  );
};

export { TagsGrade, TagsSubject, TagsTopic };
