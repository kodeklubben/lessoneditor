import React from "react";
import {
  gradeSettings,
  subjectSettings,
  topicSettings
} from "./settingsFiles/YMLTAGSSETTINGS";
import Checkbox from "./Checkbox";

const YMLtagsGrade = props => {
  return (
    <>
      {gradeSettings.map(element => (
        <div className="column">
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

const YMLtagsSubject = props => {
  return (
    <>
      {subjectSettings.map(element => (
        <div className="column">
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

const YMLtagsTopic = props => {
  return (
    <>
      {topicSettings.map(element => (
        <div className="column">
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

export { YMLtagsGrade, YMLtagsSubject, YMLtagsTopic };
