import React from "react";
import YMLtagsTopic from "./YMLtagsTopic";
import YMLtagsSubject from "./YMLtagsSubject";
import YMLtagsGrade from "./YMLtagsGrade";

class YMLfilePage extends React.Component {
  render() {
    return (
      <div className="ui grid">
        <div className="five wide column">
          <h3>Tema:</h3>
          <YMLtagsTopic myCheckboxHandler={this.props.myCheckboxHandler} />
        </div>
        <div className="five wide column">
          <h3>Fag:</h3>
          <YMLtagsSubject myCheckboxHandler={this.props.myCheckboxHandler} />
        </div>
        <div className="five wide column">
          <h3>Klassetrinn: </h3>
          <YMLtagsGrade myCheckboxHandler={this.props.myCheckboxHandler} />
        </div>
      </div>
    );
  }
}

export default YMLfilePage;
