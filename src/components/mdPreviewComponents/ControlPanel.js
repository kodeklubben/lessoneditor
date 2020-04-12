import {
  emphasis,
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
        <div className="ui icon buttons">
          {emphasis.map(element => (
            <div key={element.bTitle} className="">
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
                cname=""
              />
            </div>
          ))}
        </div>
        <div className="space" />
        <div className="ui icon buttons">
          {buttonConfig2.map(element => (
            <div key={element.bTitle} className="">
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
                cname=""
              />
            </div>
          ))}
        </div>
        <div className="space" />
        <div className="ui icon buttons">
          {buttonConfig3.map(element => (
            <div key={element.bTitle} className="">
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
        <div className="space" />
        <div className="ui icon buttons">
          {buttonConfig4.map(element => (
            <div key={element.bTitle} className="">
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
        <div className="space" />
        <div className="ui icon buttons">
          {buttonConfig5.map(element => (
            <div key={element.bTitle} className="">
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
        <div className="space" />
        <div className="ui icon buttons">
          {buttonConfig6.map(element => (
            <div key={element.bTitle} className="">
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
        <div className="space" />
        <div className="ui icon buttons">
          {buttonConfig7.map(element => (
            <div key={element.bTitle} className="">
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
      </div>
    );
  }
}

export default ControlPanel;
