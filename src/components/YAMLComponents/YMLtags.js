import React from "react";
import {
  gradeSettings,
  subjectSettings,
  topicSettings
} from "./settingsFiles/YMLTAGSSETTINGS";
import Checkbox from "./Checkbox";

const YMLtagsGrade = props => {
  return (
    <div className="ui segment">
      <div className="column">
        {gradeSettings.map(element => (
          <Checkbox
            key={element.value}
            name={element.name}
            value={element.value}
            subtag={element.subtag}
            onCheck={props.myCheckboxHandler}
          />
        ))}
      </div>
    </div>
  );
};

const YMLtagsSubject = props => {
  return (
    <div className="ui segment">
      <div className="column">
        {subjectSettings.map(element => (
          <Checkbox
            key={element.value}
            name={element.name}
            value={element.value}
            subtag={element.subtag}
            onCheck={props.myCheckboxHandler}
          />
        ))}
      </div>
    </div>
  );
};

const YMLtagsTopic = props => {
  return (
    <div className="ui segment">
      <div className="column">
        {topicSettings.map(element => (
          <Checkbox
            key={element.value}
            name={element.name}
            value={element.value}
            subtag={element.subtag}
            onCheck={props.myCheckboxHandler}
          />
        ))}
      </div>
    </div>
  );
};

export { YMLtagsGrade, YMLtagsSubject, YMLtagsTopic };
