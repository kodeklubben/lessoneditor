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
      <React.Fragment>
        <div className="row">
          {undoRedo.map(element => (
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
          ))}
        </div>

        <div className="row">
          {emphasis.map(element => (
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
          ))}
        </div>
        <div className="row">
          {lists.map(element => (
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
          ))}
        </div>
        <div className="row">
          {image.map(element => (
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
          ))}
        </div>
        <div id="saveLoad" className="row">
          {saveLoadNew.map(element => (
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
          ))}
        </div>
        <div className="column">
          <ProfileMenu />
        </div>

        <div id="sections" className="row">
          {sections.map(element => (
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
          ))}
        </div>
        <div id="code" className="row">
          {code.map(element => (
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
          ))}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    imageUrl: state.auth.imageUrl
  };
};

export default connect(mapStateToProps)(ControlPanel);
