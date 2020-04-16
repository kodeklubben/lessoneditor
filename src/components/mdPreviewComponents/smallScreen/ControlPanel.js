import {
  emphasis,
  undoRedo,
  saveLoadNew,
  image,
  lists,
  sections,
  code
} from "../settingsFiles/buttonConfig.js";
import React from "react";
import Buttons from "./Button";
import { Icon, Button, Dropdown, Divider } from "semantic-ui-react";

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

  onButtonClick = () => {
    this.props.returnPreview();
  };

  render() {
    return (
      <div className="ui segment grid">
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

        <div className="ui icon buttons">
          <Button labelPosition="left" onClick={this.onButtonClick}>
            <Icon name="eye" />
          </Button>
        </div>

        <div className="ui icon buttons">
          <Buttons
            bTitle={saveLoadNew[0].bTitle}
            icon={saveLoadNew[0].icon}
            output={saveLoadNew[0].output}
            title={saveLoadNew[0].title}
            cursorIntON={saveLoadNew[0].cursorIntON}
            cursorIntOFF={saveLoadNew[0].cursorIntOFF}
            endOutput={saveLoadNew[0].endOutput}
            onButtonClick={this.handleButtonClick}
            shortcutKey={saveLoadNew[0].shortcut}
          />
          <Buttons
            bTitle={image[0].bTitle}
            icon={image[0].icon}
            output={image[0].output}
            title={image[0].title}
            cursorIntON={image[0].cursorIntON}
            cursorIntOFF={image[0].cursorIntOFF}
            endOutput={image[0].endOutput}
            onButtonClick={this.handleButtonClick}
            shortcutKey={image[0].shortcut}
          />
        </div>
      </div>
    );
  }
}

export default ControlPanel;
