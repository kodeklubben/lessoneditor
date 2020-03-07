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
      <div className="ui knapper segment grid">
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
        <div className="space" />
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
        <div className="space" />
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
        <div className="space" />
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
        <div className="space" />
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
        <div className="space" />
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
        <div className="space" />
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
    );
  }
}

export default ControlPanel;
