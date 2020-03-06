import {
  buttonConfig,
  buttonConfig2,
  buttonConfig3,
  buttonConfig4,
  buttonConfig5,
  buttonConfig6,
  buttonConfig7
} from "./buttonConfig.js";
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
      <div className="ui knapper segment sixteen column grid">
        {buttonConfig.map(element => (
          <div key={element.bTitle} className="ui icon buttons">
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
              cname="ui button"
            />
          </div>
        ))}
        {buttonConfig2.map(element => (
          <div key={element.bTitle} className="ui icon buttons">
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
              cname="button"
            />
          </div>
        ))}
        {buttonConfig3.map(element => (
          <div key={element.bTitle} className="ui icon buttons">
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
        {buttonConfig4.map(element => (
          <div key={element.bTitle} className="ui icon buttons">
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
        {buttonConfig5.map(element => (
          <div key={element.bTitle} className="ui icon buttons">
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
        {buttonConfig6.map(element => (
          <div key={element.bTitle} className="ui icon buttons">
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
        {buttonConfig7.map(element => (
          <div key={element.bTitle} className="ui icon buttons">
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
