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
        <Checkbox
          name={element.name}
          value={element.value}
          subtag={element.subtag}
          onCheck={props.checkboxHandler}
        />
      ))}
    </React.Fragment>
  );
};

const YMLtagsSubject = props => {
  return (
    <React.Fragment>
      {subjectSettings.map(element => (
        <Checkbox
          name={element.name}
          value={element.value}
          subtag={element.subtag}
          onCheck={props.checkboxHandler}
        />
      ))}
    </React.Fragment>
  );
};

const YMLtagsTopic = props => {
  return (
    <React.Fragment>
      {topicSettings.map(element => (
        <Checkbox
          name={element.name}
          value={element.value}
          subtag={element.subtag}
          onCheck={props.checkboxHandler}
        />
      ))}
    </React.Fragment>
  );
};

export { YMLtagsGrade, YMLtagsSubject, YMLtagsTopic };
