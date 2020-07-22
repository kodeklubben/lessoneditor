import React, { useState, useEffect, useRef, useContext } from "react";
import CPButton from "./CPButton";
import ProfileMenu from "components/ProfileMenu";
import {
  emphasis,
  undoRedo,
  image,
  preview,
  lists,
  sections,
  code,
} from "../../settingsFiles/buttonConfig";

import { UserContext } from "contexts/UserContext";

import { Redirect } from "react-router-dom";

const ControlPanel = (props) => {
  const context = useContext(UserContext);
  const submitHandler = () => {
    props.submitHandler();

    setRedirect("/");
  };

  let smallScreen = useRef();

  useEffect(() => {
    if (window.innerWidth < 768) {
      smallScreen.current = true;
    } else if (window.innerWidth > 768) {
      smallScreen.current = false;
    }
  }, []);

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
      if (smallScreen.current) {
        setShowCustom("none");
      }
      props.handleButtonClick(
        bTitle,
        output,
        cursorIntON,
        cursorIntOFF,
        endOutput
      );
    }
  };

  const [showTextArea, setShowTextArea] = useState("");
  const [showPreviewArea, setShowPreviewArea] = useState("");
  const [showCustom, setShowCustom] = useState("none");
  const [redirect, setRedirect] = useState("");

  const previewOnOff = (buttonPress) => {
    if (buttonPress) {
      setShowTextArea("none");
      setShowPreviewArea("flex");
    } else {
      setShowTextArea("flex");
      setShowPreviewArea("none");
    }
  };

  return redirect ? (
    <Redirect to="/" />
  ) : (
    <>
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
            {undoRedo.map((element, index) => (
              <CPButton
                key={"element" + index}
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
            {image.map((element, index) => (
              <CPButton
                key={"element" + index}
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

          <div style={{ display: showTextArea }} className="showCustom">
            <CPButton
              bTitle="showCustom"
              icon=""
              output=""
              title="{ }"
              cursorIntON=""
              cursorIntOFF=""
              endOutput=""
              onButtonClick={handleButtonClick}
              shortcutKey=""
            />
          </div>

          <div style={{ display: showTextArea }} className="submitButton">
            <button className="ui icon button" onClick={submitHandler}>
              <i className="arrow right icon" />
            </button>
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
            {emphasis.map((element, index) => (
              <CPButton
                key={"element" + index}
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
            {lists.map((element, index) => (
              <CPButton
                key={"element" + index}
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

          <div />
        </div>

        {/*large screen */}

        <div className="upperContainerLarge">
          <div className="space" />
          <div className="ui icon buttons undoRedo">
            {undoRedo.map((element, index) => (
              <CPButton
                key={"element" + index}
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
            {emphasis.map((element, index) => (
              <CPButton
                key={"element" + index}
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
            {lists.map((element, index) => (
              <CPButton
                key={"element" + index}
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
            {image.map((element, index) => (
              <CPButton
                key={"element" + index}
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
          <div
            style={
              smallScreen.current
                ? { display: showTextArea }
                : { display: "none" }
            }
            className="showCustom"
          >
            <CPButton
              bTitle="showCustom"
              icon=""
              output=""
              title="{ }"
              cursorIntON=""
              cursorIntOFF=""
              endOutput=""
              onButtonClick={handleButtonClick}
              shortcutKey=""
            />
          </div>
          <div style={{ display: "flex" }} className="submitButton">
            <ProfileMenu
              name={context.user ? context.user.name : ""}
              email={context.user ? context.user.email : ""}
              photo={context.user ? context.user.photo : ""}
            />
          </div>
        </div>

        <div
          style={
            smallScreen.current ? { display: showCustom } : { display: "flex" }
          }
          className="customButtons"
        >
          <div className="space" />
          <div className="ui buttons sections">
            {sections.map((element, index) => (
              <CPButton
                key={"element" + index}
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
            {code.map((element, index) => (
              <CPButton
                key={"element" + index}
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
          <button
            style={{ marginLeft: "auto" }}
            className="ui  icon button submit"
            onClick={submitHandler}
          >
            <i className="home right icon" />
          </button>

          <div className="space" />
        </div>
      </div>
    </>
  );
};

export default ControlPanel;
