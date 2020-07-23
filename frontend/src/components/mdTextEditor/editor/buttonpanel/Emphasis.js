import React from "react";
import CPButton from "./CPButton";

import {
  cancelButton,
  buttonAction as emphasisAction,
  heading,
} from "./utils/buttonMethods";

import { emphasis as config } from "../../settingsFiles/buttonConfig";
import { topicSettings } from "components/lessonForm/settingsFiles/YMLTAGSSETTINGS";

let output;
let cancelResults;
let results;

const Emphasis = ({
  testings,
  editorRef,
  cursorPositionStart,
  cursorPositionEnd,
  mdText,
  buttonValues,
  setMdText,
  setCursorPosition,
  setCursor,
  setButtonValues,
}) => {
  const setChanges = (mdText, cursorPositionStart, cursorPositionEnd) => {
    setCursor(cursorPositionStart, cursorPositionEnd);
    setCursorPosition(cursorPositionStart, cursorPositionEnd);
    setMdText(mdText);
  };

  const setEmphasis = (button, cursorIntON, cursorIntOFF, output) => {
    cancelResults = cancelButton(
      buttonValues[button],
      mdText,
      cursorPositionStart,
      cursorPositionEnd,
      cursorIntON,
      output
    );
    if (cancelResults.cancel) {
      setChanges(
        cancelResults.mdText,
        cancelResults.cursorPositionStart,
        cancelResults.cursorPositionEnd
      );
      return;
    }

    results = emphasisAction(
      buttonValues[button],
      mdText,
      cursorPositionStart,
      cursorPositionEnd,
      cursorIntON,
      cursorIntOFF,
      output
    );

    setChanges(
      results.mdText,
      results.cursorPositionStart,
      results.cursorPositionEnd
    );
  };

  const handleButtonClick = (button) => {
    editorRef.current.focus();
    setButtonValues((prevState) => ({
      ...prevState,
      [button]: !buttonValues[button],
    }));
    switch (button) {
      case "bold":
        testings();
        setEmphasis(button, 2, 2, "****");
        break;
      case "italic":
        setEmphasis(button, 1, 1, "**");
        break;
      case "heading":
        output = "## ";

        results = heading(
          buttonValues[button],
          mdText,
          cursorPositionStart,
          output
        );
        setButtonValues((prevState) => ({
          ...prevState,
          [button]: results.isOn,
        }));
        setChanges(
          results.mdText,
          results.cursorPositionStart,
          results.cursorPositionStart
        );

        break;

      case "strikethrough":
        setEmphasis(button, 2, 2, "~~~~");
        break;
      default:
        break;
    }
  };
  return (
    <>
      <div className="ui icon buttons emphasis">
        {config.map((element, index) => (
          <CPButton
            key={"element" + index}
            buttonTitle={element.buttonTitle}
            icon={element.icon}
            title={element.title}
            onButtonClick={handleButtonClick}
            shortcutKey={element.shortcut}
          />
        ))}
      </div>
    </>
  );
};

export default Emphasis;
