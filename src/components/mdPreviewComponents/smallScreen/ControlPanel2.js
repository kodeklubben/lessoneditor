import {
  emphasis,
  lists,
  sections,
  saveLoadNew,
  code
} from "../settingsFiles/buttonConfig.js";
import React from "react";
import Button from "../Buttons";
import { Icon, Dropdown, Divider } from "semantic-ui-react";

const test = "{ }";

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
      <div className="ui segment grid buttonBorderSmall">
        <div className="ui icon buttons">
          <div />
          {emphasis.map(element => (
            <div key={element.bTitle} className="">
              <Button
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
        <div />
        <Dropdown icon="list ul" floating className="ui icon dropdown">
          <Dropdown.Menu>
            {lists.map(element => (
              <Dropdown.Item
                className="dropdownItem"
                icon={element.icon}
                onClick={() =>
                  this.handleButtonClick(
                    element.bTitle,
                    element.output,
                    element.cursorIntON,
                    element.cursorIntOFF,
                    element.endOutput
                  )
                }
              />
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <div />
        <Dropdown
          icon="list alternate outline"
          floating
          className="ui icon dropdown"
        >
          <Dropdown.Menu>
            {sections.map(element => (
              <Dropdown.Item
                className="dropdownItem"
                onClick={() =>
                  this.handleButtonClick(
                    element.bTitle,
                    element.output,
                    element.cursorIntON,
                    element.cursorIntOFF,
                    element.endOutput
                  )
                }
              >
                {element.title}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }
}

export default ControlPanel;
