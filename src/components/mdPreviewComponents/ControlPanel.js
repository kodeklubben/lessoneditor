import {
  emphasis,
  undoRedo,
  saveLoadNew,
  image,
  lists,
  sections,
  code
} from "./settingsFiles/buttonConfig.js";
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
              />
            </div>
          ))}
        </div>
        <div className="space" />
        <div className="ui icon buttons">
          {undoRedo.map(element => (
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
          {saveLoadNew.map(element => (
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
          {image.map(element => (
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
          {lists.map(element => (
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
          {sections.map(element => (
            <div key={element.bTitle} className="sections">
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
          {code.map(element => (
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
