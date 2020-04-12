import React from "react";
import { YMLtagsGrade, YMLtagsSubject, YMLtagsTopic } from "./YMLtags";

const TOPIC = "Tema:";
const SUBJECT = "Fag:";
const GRADE = "Klassetrinn:";

class YMLfilePage extends React.Component {
  render() {
    return (
      <div className="ui three column grid">
        <div className="column">
          <h3>{TOPIC}</h3>
          <YMLtagsTopic myCheckboxHandler={this.props.myCheckboxHandler} />
        </div>
        <div className="column">
          <h3>{SUBJECT}</h3>
          <YMLtagsSubject myCheckboxHandler={this.props.myCheckboxHandler} />
        </div>
        <div className="column">
          <h3>{GRADE}</h3>
          <YMLtagsGrade myCheckboxHandler={this.props.myCheckboxHandler} />
        </div>
      </div>
    );
  }
}

export default YMLfilePage;
