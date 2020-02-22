import React from "react";
import Checkbox from "./Checkbox";

class YMLtagsGrade extends React.Component {
  render() {
    return (
      <div className="topicBox">
        <div className="ui equal width grid">
          <div className="column">
            <Checkbox
              name="Barnehage"
              value="preschool"
              subtag="grade"
              onCheck={this.props.myCheckboxHandler}
            />
            <Checkbox
              name="1.-4. klasse"
              value="primary"
              subtag="grade"
              onCheck={this.props.myCheckboxHandler}
            />
          </div>
          <div className="column">
            <Checkbox
              name="5.-7. klasse"
              value="secondary"
              subtag="grade"
              onCheck={this.props.myCheckboxHandler}
            />
            <Checkbox
              name="8.-10. klasse"
              value="junior"
              subtag="grade"
              onCheck={this.props.myCheckboxHandler}
            />
          </div>
          <div className="column">
            <Checkbox
              name="Videregående Skole"
              value="senior"
              subtag="grade"
              onCheck={this.props.myCheckboxHandler}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default YMLtagsGrade;
