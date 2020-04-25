import React from "react";
import { connect } from "react-redux";
import CPButton from "./components/CPButton";
import ProfileMenu from "../../../ProfileMenu";
import {
  emphasis,
  undoRedo,
  saveLoadNew,
  image,
  lists,
  sections,
  code
} from "../../settingsFiles/buttonConfig";

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
      <div className="">
        <div className="ui sixteen column grid">
          <div className="column">
            <CPButton
              onButtonClick={() => {
                return 2 + 2;
              }}
              icon="eye"
            />
          </div>

          {undoRedo.map(element => (
            <div key={element.bTitle} className="column">
              <CPButton
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

          {emphasis.map(element => (
            <div key={element.bTitle} className="column">
              <CPButton
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

          {lists.map(element => (
            <div key={element.bTitle} className="column">
              <CPButton
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

          {image.map(element => (
            <div key={element.bTitle} className="column">
              <CPButton
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

          {saveLoadNew.map(element => (
            <div key={element.bTitle} className="column">
              <CPButton
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
          <div className="column">
            <ProfileMenu />
          </div>
          <div className="column">
            <CPButton
              icon="right arrow"
              onClick={this.props.mySubmitHandler}
            ></CPButton>
          </div>
        </div>

        <div className="ui sixteen column grid">
          {sections.map(element => (
            <div key={element.bTitle} className="two wide column">
              <CPButton
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

          {code.map(element => (
            <div key={element.bTitle} className="column">
              <CPButton
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

const mapStateToProps = state => {
  return {
    imageUrl: state.auth.imageUrl
  };
};

export default connect(mapStateToProps)(ControlPanel);
