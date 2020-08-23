import React, { useContext } from "react";
import CodeButtonComponent from "./CodeButtonComponent";
import { useHotkeys } from "react-hotkeys-hook";
import { LessonContext } from "contexts/LessonContext";
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
  cursorPositionStart,
  cursorPositionEnd,
  mdText,
  buttonValues,
  setMdText,
  setCursorPosition,
  setCursor,
  setButtonValues,
}) => {
  const context = useContext(LessonContext);
  const { data } = context;
  const course = data.course;

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
          buttonValues={buttonValues}
          key={"element" + index}
          buttonTitle={element[1].buttonTitle}
          icon={element[1].icon}
          title={element[1].title}
          onButtonClick={handleButtonClick}
          shortcutKey={element[1].shortcut}
          course={course}
          isOn={buttonValues.code}
        />
      ))}
    </>
  );
};

export default CodeButton;
