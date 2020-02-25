import React from "react";
import Button from "./Button";

class ControlPanel extends React.Component {
  handleButtonClick = value => {
    this.props.handleButtonClick(value);
  };

  render() {
    return (
      <div className="Buttons">
        <div className="ui segment four column grid">
          <div className="column">
            <Button
              icon="bold"
              output=" **bold text here** "
              title=""
              onButtonClick={this.handleButtonClick}
            />
          </div>
          <div className="column">
            <Button
              icon="italic"
              output=" _italic text here_ "
              title=""
              onButtonClick={this.handleButtonClick}
            />
          </div>
          <div className="column">
            <Button
              icon=""
              output=" {.activity} "
              title="Activity"
              onButtonClick={this.handleButtonClick}
            />
          </div>
          <div className="column">
            <Button
              icon=""
              output=" {.intro} "
              title="Introduction"
              onButtonClick={this.handleButtonClick}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ControlPanel;
