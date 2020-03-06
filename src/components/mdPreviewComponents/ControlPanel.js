import buttonConfig from "./buttonConfig.js";
import React from "react";
import Buttons from "./Button";

class ControlPanel extends React.Component {
  handleButtonClick = (
    bTitle,
    output,
    cursorIntON,
    cursorIntOFF,
    endOutput
  ) => {
    this.props.handleButtonClick(
      bTitle,
      output,
      cursorIntON,
      cursorIntOFF,
      endOutput
    );
  };

  render() {
    return (
      // <div className="Buttons">
      <div className="ui knapper segment eight column grid">
        {buttonConfig.map(element => (
          <div key={element.bTitle} className="column">
            <Buttons
              bTitle={element.bTitle}
              icon={element.icon}
              output={element.output}
              title={element.title}
              cursorIntON={element.cursorIntON}
              cursorIntOFF={element.cursorIntOFF}
              endOutput={element.endOutput}
              onButtonClick={this.handleButtonClick}
              shortcutKey={element.shortcut}
            />
          </div>
        ))}
      </div>
      // </div>
    );
  }
}

export default ControlPanel;
