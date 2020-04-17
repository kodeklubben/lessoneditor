import React from "react";
import {
  gradeSettings,
  subjectSettings,
  topicSettings
} from "./settingsFiles/YMLTAGSSETTINGS";
import Checkbox from "./Checkbox";

const YMLtagsGrade = props => {
  return (
    <div>
      {gradeSettings.map(element => (
        <Checkbox
          key={element.value}
          name={element.name}
          value={element.value}
          subtag={element.subtag}
          onCheck={props.checkboxHandler}
        />
      ))}
    </div>
  );
};

const YMLtagsSubject = props => {
  return (
    <div>
      {subjectSettings.map(element => (
        <Checkbox
          key={element.value}
          name={element.name}
          value={element.value}
          subtag={element.subtag}
          onCheck={props.checkboxHandler}
        />
      ))}
    </div>
  );
};

const YMLtagsTopic = props => {
  return (
    <div>
      {topicSettings.map(element => (
        <Checkbox
          key={element.value}
          name={element.name}
          value={element.value}
          subtag={element.subtag}
          onCheck={props.checkboxHandler}
        />
      ))}
    </div>
  );
};

export { YMLtagsGrade, YMLtagsSubject, YMLtagsTopic };
