import React from "react";
import {
  gradeSettings,
  subjectSettings,
  topicSettings
} from "./settingsFiles/YMLTAGSSETTINGS";
import Checkbox from "./Checkbox";

const YMLtagsGrade = props => {
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};

const YMLtagsSubject = props => {
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};

const YMLtagsTopic = props => {
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};

export { YMLtagsGrade, YMLtagsSubject, YMLtagsTopic };
