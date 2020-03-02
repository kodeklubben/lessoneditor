import buttonConfig from "./buttonConfig.js";
import React from "react";
import Button from "./Button";

class ControlPanel extends React.Component {
  handleButtonClick = (value, cursorIntON, cursorIntOFF, bTitle, endOutput) => {
    this.props.handleButtonClick(
      value,
      cursorIntON,
      cursorIntOFF,
      bTitle,
      endOutput
    );
  };

  render() {
    return (
      <div className="Buttons">
        <div className="ui segment six column grid">
          {buttonConfig.map(element => (
            <div key={element.bTitle} className="column">
              <Button
                bTitle={element.bTitle}
                icon={element.icon}
                output={element.output}
                title={element.title}
                cursorIntON={element.cursorIntON}
                cursorIntOFF={element.cursorIntOFF}
                endOutput={element.endOutput}
                onButtonClick={this.handleButtonClick}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default ControlPanel;
