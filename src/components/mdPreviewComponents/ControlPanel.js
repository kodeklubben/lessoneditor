import buttonConfig from "./buttonConfig.js";
import dropdownConfig from "./dropdownConfig";
import React from "react";
import Button from "./Button";
import Dropdown from "../Dropdown";

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
          {dropdownConfig.map(element2 => (
            <div key={element2.bTitle} className="column">
              <Dropdown
                bTitle={element2.bTitle}
                icon={element2.icon}
                output={element2.output}
                title={element2.title}
                cursorIntON={element2.cursorIntON}
                cursorIntOFF={element2.cursorIntOFF}
                endOutput={element2.endOutput}
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
