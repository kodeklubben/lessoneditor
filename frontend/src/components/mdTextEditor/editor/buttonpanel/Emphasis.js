import React from "react";
import CPButton from "./CPButton";

import { useHotkeys } from "react-hotkeys-hook";

import {
  cancelButton,
  buttonAction as emphasisAction,
  heading,
} from "./utils/buttonMethods";

import {
  KEY_COMBINATIONS as KEY,
  emphasis as config,
} from "../../settingsFiles/buttonConfig";

let output;
let cancelResults;
let results;
let buttonValue;

const Emphasis = ({
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

  const setEmphasis = (isON, button, cursorIntON, cursorIntOFF, output) => {
    cancelResults = cancelButton(
      isON,
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
      isON,
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

  const setButton = (value) => {
    setButtonValues((prevButtonValues) => ({
      ...prevButtonValues,
      [value]: !buttonValues[value],
    }));
  };

  useHotkeys(
    `${KEY.bold}, ${KEY.italic}, ${KEY.heading}, ${KEY.strikethrough}`,
    (event, handler) => {
      console.log(handler);
      switch (handler.key) {
        case KEY.bold:
          alert("");
          event.preventDefault();
          buttonValue = KEY.bold;
          setButton(buttonValue);
          setEmphasis(buttonValues[buttonValue], buttonValue, 2, 2, "****");
          break;
        case KEY.italic:
          event.preventDefault();
          buttonValue = KEY.italic;
          setButton(buttonValue);
          setEmphasis(buttonValues[buttonValue], buttonValue, 1, 1, "**");
          break;
        case KEY.heading:
          alert("you pressed r!");
          break;
        case KEY.strikethrough:
          event.preventDefault();
          buttonValue = KEY.strikethrough;
          setButton(buttonValue);
          setEmphasis(buttonValues[buttonValue], buttonValue, 2, 2, "~~~~");
          break;
        default:
          break;
      }
      return false;
    },
    { enableOnTags: "TEXTAREA", keydown: true },
    [setButton, setEmphasis]
  );

  const handleButtonClick = (button) => {
    console.log(KEY);
    editorRef.current.focus();
    setButtonValues((prevButtonValues) => ({
      ...prevButtonValues,
      [button]: !buttonValues[button],
    }));
    switch (button) {
      case "bold":
        setEmphasis(buttonValues[button], button, 2, 2, "****");
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
        setButtonValues((prevButtonValues) => ({
          ...prevButtonValues,
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
