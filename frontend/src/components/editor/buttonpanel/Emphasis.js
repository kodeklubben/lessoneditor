import React from "react";
import CPButton from "./ButtonComponent";

import { useHotkeys } from "react-hotkeys-hook";

import {
  cancelButton,
  buttonAction as emphasisAction,
  heading,
} from "./utils/buttonMethods";

import {
  KEY_COMBINATIONS as KEY,
  emphasis as config,
} from "../settingsFiles/buttonConfig";

let output;
let cancelResults;
let results;
let buttonTitle;

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

  const setButton = (value) => {
    setButtonValues((prevButtonValues) => ({
      ...prevButtonValues,
      [value]: !buttonValues[value],
    }));
  };

  const setEmphasis = (isON, cursorIntON, cursorIntOFF, output) => {
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

  const set = {
    bold: () => {
      buttonTitle = config.bold.buttonTitle;
      setButton(buttonTitle);
      setEmphasis(
        buttonValues[buttonTitle],
        config.bold.cursorIntON,
        config.bold.cursorIntOFF,
        config.bold.output
      );
    },
    italic: () => {
      buttonTitle = config.italic.buttonTitle;
      setButton(buttonTitle);
      setEmphasis(
        buttonValues[buttonTitle],
        config.italic.cursorIntON,
        config.italic.cursorIntOFF,
        config.italic.output
      );
    },
    heading: () => {
      buttonTitle = config.heading.buttonTitle;
      output = config.heading.output;

      results = heading(
        buttonValues[buttonTitle],
        mdText,
        cursorPositionStart,
        output
      );
      setButtonValues((prevButtonValues) => ({
        ...prevButtonValues,
        [buttonTitle]: results.isOn,
      }));
      setChanges(
        results.mdText,
        results.cursorPositionStart,
        results.cursorPositionStart
      );
    },
    strikethrough: () => {
      buttonTitle = config.strikethrough.buttonTitle;
      setButton(buttonTitle);
      setEmphasis(
        buttonValues[buttonTitle],
        config.strikethrough.cursorIntON,
        config.strikethrough.cursorIntOFF,
        config.strikethrough.output
      );
    },
  };

  useHotkeys(
    `${KEY.bold}, ${KEY.italic}, ${KEY.heading}, ${KEY.strikethrough}`,
    (event, handler) => {
      event.preventDefault();
      switch (handler.key) {
        case KEY.bold:
          set.bold();
          break;
        case KEY.italic:
          set.italic();
          break;
        case KEY.heading:
          set.heading();
          break;
        case KEY.strikethrough:
          set.strikethrough();
          break;
        default:
          break;
      }
      return false;
    },
    { enableOnTags: "TEXTAREA", keydown: true },
    [setButton, setEmphasis, heading]
  );

  const handleButtonClick = (button) => {
    editorRef.current.focus();
    switch (button) {
      case config.bold.buttonTitle:
        set.bold();
        break;
      case config.italic.buttonTitle:
        set.italic();
        break;
      case config.heading.buttonTitle:
        set.heading();
        break;
      case config.strikethrough.buttonTitle:
        set.strikethrough();
        break;
      default:
        break;
    }
  };
  return (
    <>
      {Object.entries(config).map((element, index) => (
        <CPButton
          buttonValues={buttonValues}
          key={"element" + index}
          buttonTitle={element[1].buttonTitle}
          icon={element[1].icon}
          title={element[1].title}
          onButtonClick={handleButtonClick}
          shortcutKey={element[1].shortcut}
        />
      ))}
    </>
  );
};

export default Emphasis;
