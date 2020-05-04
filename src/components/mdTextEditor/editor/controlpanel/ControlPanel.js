import React from "react";
import { connect } from "react-redux";
import CPButton from "./components/CPButton";
import ProfileMenu from "../../../ProfileMenu";
import {
  emphasis,
  undoRedo,
  saveLoadNew,
  image,
  preview,
  lists,
  sections,
  code
} from "../../settingsFiles/buttonConfig";

const ControlPanel = props => {
  const handleButtonClick = (
    bTitle,
    output,
    cursorIntON,
    cursorIntOFF,
    endOutput
  ) => {
    if (bTitle === "preview") {
      props.handlePreview(true);
    } else {
      props.handleButtonClick(
        bTitle,
        output,
        cursorIntON,
        cursorIntOFF,
        endOutput
      );
    }
  };

  return (
    <React.Fragment>
      <div className="preview">
        <CPButton
          bTitle={preview[0].bTitle}
          icon={preview[0].icon}
          output={preview[0].output}
          title={preview[0].title}
          cursorIntON={preview[0].cursorIntON}
          cursorIntOFF={preview[0].cursorIntOFF}
          endOutput={preview[0].endOutput}
          onButtonClick={handleButtonClick}
          shortcutKey={preview[0].shortcut}
        />
      </div>
      <div style={{ marginRight: "1.5rem" }} />
      <div className="row">
        <div id="undoRedo" className="ui buttons">
          {undoRedo.map(element => (
            <CPButton
              bTitle={element.bTitle}
              icon={element.icon}
              output={element.output}
              title={element.title}
              cursorIntON={element.cursorIntON}
              cursorIntOFF={element.cursorIntOFF}
              endOutput={element.endOutput}
              onButtonClick={handleButtonClick}
              shortcutKey={element.shortcut}
            />
          ))}
        </div>
      </div>
      <div style={{ marginRight: "1.5rem" }} />
      <div className="row">
        <div id="emphasis" className="ui buttons">
          {emphasis.map(element => (
            <CPButton
              bTitle={element.bTitle}
              icon={element.icon}
              output={element.output}
              title={element.title}
              cursorIntON={element.cursorIntON}
              cursorIntOFF={element.cursorIntOFF}
              endOutput={element.endOutput}
              onButtonClick={handleButtonClick}
              shortcutKey={element.shortcut}
            />
          ))}
        </div>
      </div>
      <div style={{ marginRight: "1.5rem" }} />
      <div className="row">
        <div id="lists" className="ui buttons">
          {lists.map(element => (
            <CPButton
              bTitle={element.bTitle}
              icon={element.icon}
              output={element.output}
              title={element.title}
              cursorIntON={element.cursorIntON}
              cursorIntOFF={element.cursorIntOFF}
              endOutput={element.endOutput}
              onButtonClick={handleButtonClick}
              shortcutKey={element.shortcut}
            />
          ))}
        </div>
      </div>
      <div style={{ marginRight: "1.5rem" }} />
      <div className="row">
        <div id="image" className="ui buttons">
          {image.map(element => (
            <CPButton
              bTitle={element.bTitle}
              icon={element.icon}
              output={element.output}
              title={element.title}
              cursorIntON={element.cursorIntON}
              cursorIntOFF={element.cursorIntOFF}
              endOutput={element.endOutput}
              onButtonClick={handleButtonClick}
              shortcutKey={element.shortcut}
            />
          ))}
        </div>
      </div>
      <div style={{ marginRight: "4rem" }} />
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {
    imageUrl: state.auth.imageUrl
  };
};

export default connect(mapStateToProps)(ControlPanel);

{
  /* <div id="saveLoad" className="row">
        <div className="ui buttons">
          {saveLoadNew.map(element => (
            <CPButton
              bTitle={element.bTitle}
              icon={element.icon}
              output={element.output}
              title={element.title}
              cursorIntON={element.cursorIntON}
              cursorIntOFF={element.cursorIntOFF}
              endOutput={element.endOutput}
              onButtonClick={handleButtonClick}
              shortcutKey={element.shortcut}
            />
          ))}
        </div>
      </div>
      <div style={{ marginRight: "4rem" }} />
      <div id="sections" className="row">
        <div className="ui buttons">
          {sections.map(element => (
            <CPButton
              bTitle={element.bTitle}
              icon={element.icon}
              output={element.output}
              title={element.title}
              cursorIntON={element.cursorIntON}
              cursorIntOFF={element.cursorIntOFF}
              endOutput={element.endOutput}
              onButtonClick={handleButtonClick}
              shortcutKey={element.shortcut}
            />
          ))}
        </div>
      </div>
      <div style={{ marginRight: "4rem" }} />
      <div id="code" className="row">
        <div className="ui buttons">
          {code.map(element => (
            <CPButton
              bTitle={element.bTitle}
              icon={element.icon}
              output={element.output}
              title={element.title}
              cursorIntON={element.cursorIntON}
              cursorIntOFF={element.cursorIntOFF}
              endOutput={element.endOutput}
              onButtonClick={handleButtonClick}
              shortcutKey={element.shortcut}
            />
          ))}
        </div>
      </div> */
}
