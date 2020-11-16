import React from "react";
import CodeButtonComponent from "./CodeButtonComponent";
import { useHotkeys } from "react-hotkeys-hook";
import {
  buttonAction as codeAction,
  cancelButton,
} from "./utils/buttonMethods";
import {
  KEY_COMBINATIONS as KEY,
  codebutton as config,
} from "../settingsFiles/buttonConfig";

let results;
let cancelResults;
let buttonTitle;

const CodeButton = ({
  editorRef,
  mdText,
  cursorPositionStart,
  cursorPositionEnd,
  buttonValues,
  setMdText,
  setCursorPosition,
  setCursor,
  setButtonValues,
  course,
  courseTitle,
}) => {
  const outputCodeBlock =
    config.codeblock.output.slice(0, 3) +
    (course === "scratch" ? "blocks" : course) +
    config.codeblock.output.slice(3);

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

  const setCode = (button, cursorIntON, cursorIntOFF, output) => {
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

    results = codeAction(
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

  const set = {
    inline: () => {
      buttonTitle = config.inline.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.inline.cursorIntON,
        config.inline.cursorIntOFF,
        config.inline.output
      );
    },
    codeblock: () => {
      buttonTitle = config.codeblock.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.codeblock.cursorIntON +
          (course === "scratch" ? 6 : course.length),
        config.codeblock.cursorIntOFF,
        outputCodeBlock
      );
    },
  };

  useHotkeys(
    `${KEY.inline}, ${KEY.codeblock}`,
    (event, handler) => {
      event.preventDefault();
      switch (handler.key) {
        case KEY.inline:
          set.inline();
          break;
        case KEY.codeblock:
          set.codeblock();
          break;
        default:
          break;
      }
      return false;
    },
    { enableOnTags: "TEXTAREA", keydown: true },
    [setButton, setCode]
  );

  const handleButtonClick = (button) => {
    editorRef.current.focus();
    setButtonValues((prevState) => ({
      ...prevState,
      [button]: !buttonValues[button],
    }));
    switch (button) {
      case config.inline.buttonTitle:
        set.inline();
        break;
      case config.codeblock.buttonTitle:
        set.codeblock();
        break;
      default:
        break;
    }
  };
  return (
    <>
      {Object.entries(config).map((element, index) => (
        <CodeButtonComponent
          key={"element" + index}
          buttonValues={buttonValues}
          title={element[1].title}
          onButtonClick={handleButtonClick}
          buttonTitle={element[1].buttonTitle}
          shortcutKey={element[1].shortcut}
          course={course}
          courseTitle={courseTitle}
          style={element[1].style}
        />
      ))}
    </>
  );
};

export default CodeButton;
