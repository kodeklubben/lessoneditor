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
import { Input } from "semantic-ui-react";

const ControlPanel = props => {
  const handleButtonClick = (
    bTitle,
    output,
    cursorIntON,
    cursorIntOFF,
    endOutput
  ) => {
    if (bTitle === "preview") {
      previewOnOff(props.handlePreview());
      props.handleButtonClick(
        bTitle,
        output,
        cursorIntON,
        cursorIntOFF,
        endOutput
      );
    } else if (bTitle === "showCustom") {
      if (showCustom === "none") {
        setShowCustom("flex");
      } else {
        setShowCustom("none");
      }
    } else {
      setShowCustom("none");
      props.handleButtonClick(
        bTitle,
        output,
        cursorIntON,
        cursorIntOFF,
        endOutput
      );
    }
  };

  const [showTextArea, setShowTextArea] = React.useState("");
  const [showPreviewArea, setShowPreviewArea] = React.useState("");
  const [showCustom, setShowCustom] = React.useState("none");

  const previewOnOff = buttonPress => {
    if (buttonPress) {
      setShowTextArea("none");
      setShowPreviewArea("flex");
    } else {
      setShowTextArea("flex");
      setShowPreviewArea("none");
    }
  };

  const customOnOff = e => {
    e.preventDefault();
    if (showCustom === "none") {
      setShowCustom("flex");
    } else {
      setShowCustom("none");
    }
  };

  return (
    <React.Fragment>
      {/*small screen */}
      <div className="flexContainer">
        <div className="upperContainer">
          <div className="ui icon buttons preview">
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
          <div
            style={{ display: showTextArea }}
            className="ui icon buttons undoRedo"
          >
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

          <div
            style={{ display: showTextArea }}
            className="ui icon buttons image"
          >
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

          <div className="space" />
          <div className="showCustom">
            <CPButton
              bTitle="showCustom"
              icon=""
              output=""
              title="{}"
              cursorIntON=""
              cursorIntOFF=""
              endOutput=""
              onButtonClick={handleButtonClick}
              shortcutKey=""
            />
          </div>
        </div>
        <div className="textWindows">
          <div style={{ display: showTextArea }} className="textWindow">
            {props.MDTextArea}
          </div>
          <div style={{ display: showPreviewArea }} className="previewWindow">
            {props.MDPreview}
          </div>
        </div>

        <div style={{ display: showTextArea }} className="bottomContainer">
          <div className="ui icon buttons emphasis">
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

          <div className="ui icon buttons lists">
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

        {/*large screen */}

        <div className="upperContainerLarge">
          <div className="space" />
          <div className="ui icon buttons undoRedo">
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

          <div className="space" />
          <div className="ui icon buttons emphasis">
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

          <div className="space" />
          <div className="ui icon buttons lists">
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

          <div className="space" />
          <div className="ui icon buttons image">
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
          <div className="space" />
          <div className="showCustom">
            <CPButton
              bTitle="showCustom"
              icon=""
              output=""
              title="{}"
              cursorIntON=""
              cursorIntOFF=""
              endOutput=""
              onButtonClick={handleButtonClick}
              shortcutKey=""
            />
          </div>
        </div>

        <div style={{ display: showCustom }} className="customButtons">
          <div className="space" />
          <div className="ui buttons sections">
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
          <div className="space" />
          <div className="ui buttons code">
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

          <div className="space" />
        </div>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {
    imageUrl: state.auth.imageUrl
  };
};

export default connect(mapStateToProps)(ControlPanel);
