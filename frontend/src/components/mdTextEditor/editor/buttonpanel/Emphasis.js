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
  emphasis,
} from "../../settingsFiles/buttonConfig";

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
      buttonTitle = emphasis.bold.buttonTitle;
      setButton(buttonTitle);
      setEmphasis(
        buttonValues[buttonTitle],
        emphasis.bold.cursorIntON,
        emphasis.bold.cursorIntOFF,
        emphasis.bold.output
      );
    },
    italic: () => {
      buttonTitle = emphasis.italic.buttonTitle;
      setButton(buttonTitle);
      setEmphasis(
        buttonValues[buttonTitle],
        emphasis.italic.cursorIntON,
        emphasis.italic.cursorIntOFF,
        emphasis.italic.output
      );
    },
    heading: () => {
      buttonTitle = emphasis.heading.buttonTitle;
      output = emphasis.heading.output;

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
      buttonTitle = emphasis.strikethrough.buttonTitle;
      setButton(buttonTitle);
      setEmphasis(
        buttonValues[buttonTitle],
        emphasis.strikethrough.cursorIntON,
        emphasis.strikethrough.cursorIntOFF,
        emphasis.strikethrough.output
      );
    },
  };

  useHotkeys(
    `${KEY.bold}, ${KEY.italic}, ${KEY.heading}, ${KEY.strikethrough}`,
    (event, handler) => {
      switch (handler.key) {
        case KEY.bold:
          event.preventDefault();
          set.bold();
          break;
        case KEY.italic:
          event.preventDefault();
          set.italic();
          break;
        case KEY.heading:
          event.preventDefault();
          set.heading();
          break;
        case KEY.strikethrough:
          event.preventDefault();
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
      case "bold":
        set.bold();
        break;
      case "italic":
        set.italic();
        break;
      case "heading":
        set.heading();
        break;

      case "strikethrough":
        set.strikethrough();
        break;
      default:
        break;
    }
  };
  return (
    <>
      <div className="ui icon buttons emphasis">
        {Object.entries(emphasis).map((element, index) => (
          <CPButton
            key={"element" + index}
            buttonTitle={element[1].buttonTitle}
            icon={element[1].icon}
            title={element[1].title}
            onButtonClick={handleButtonClick}
            shortcutKey={element[1].shortcut}
          />
        ))}
      </div>
    </>
  );
};

export default Emphasis;
