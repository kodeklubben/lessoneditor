import React from "react";
import {
  gradeSettings,
  subjectSettings,
  topicSettings
} from "./settingsFiles/YMLTAGSSETTINGS";
import Checkbox from "./Checkbox";

const YMLtagsGrade = props => {
  return (
    <div className="">
      {gradeSettings.map(element => (
        <div className="column">
          <Checkbox
            key={element.value}
            name={element.name}
            value={element.value}
            subtag={element.subtag}
            onCheck={props.checkboxHandler}
          />
        </div>
      ))}
    </div>
  );
};

const YMLtagsSubject = props => {
  return (
    <React.Fragment>
      {subjectSettings.map(element => (
        <div className="column">
          <Checkbox
            key={element.value}
            name={element.name}
            value={element.value}
            subtag={element.subtag}
            onCheck={props.checkboxHandler}
          />
        </div>
      ))}
    </React.Fragment>
  );
};

const YMLtagsTopic = props => {
  return (
    <React.Fragment>
      {topicSettings.map(element => (
        <div className="column">
          <Checkbox
            key={element.value}
            name={element.name}
            value={element.value}
            subtag={element.subtag}
            onCheck={props.checkboxHandler}
          />
        </div>
      ))}
    </React.Fragment>
  );
};

export { YMLtagsGrade, YMLtagsSubject, YMLtagsTopic };
