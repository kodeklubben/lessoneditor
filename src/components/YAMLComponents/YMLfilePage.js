import React from "react";
import { YMLtagsGrade, YMLtagsSubject, YMLtagsTopic } from "./YMLtags";
import { YML_TEXT } from "./settingsFiles/languages/formpage_NO";

class YMLfilePage extends React.Component {
  render() {
    return (
      <div className="ui three column grid">
        <div className="column">
          <h3>{YML_TEXT.topic}</h3>
          <YMLtagsTopic myCheckboxHandler={this.props.myCheckboxHandler} />
        </div>
        <div className="column">
          <h3>{YML_TEXT.subject}</h3>
          <YMLtagsSubject myCheckboxHandler={this.props.myCheckboxHandler} />
        </div>
        <div className="column">
          <h3>{YML_TEXT.grade}</h3>
          <YMLtagsGrade myCheckboxHandler={this.props.myCheckboxHandler} />
        </div>
      </div>
    );
  }
}

export default YMLfilePage;
