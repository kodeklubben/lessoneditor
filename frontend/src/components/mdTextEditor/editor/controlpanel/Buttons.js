import React, { useState } from "react";
import CPButton from "./CPButton";

import editorButtonsValue from "../editorButtonsValue";

import { emphasis } from "../../settingsFiles/buttonConfig";

let cursorIntON;
let cursorIntOFF;
let output;
let cancelResults;
let results;

const Buttons = ({
  editorRef,
  inputText,
  cursorPositionStart,
  cursorPositionEnd,
  setMdText,
  setCursorPosition,
  setCursor,
  setInputText,
}) => {
  let [isButtonOn, setButton] = useState(editorButtonsValue);

  const setChanges = (inputText, cursorPositionStart, cursorPositionEnd) => {
    // setUndo(results.inputText, results.cursorPositionStart);
    setInputText(inputText);
    setCursor(cursorPositionStart, cursorPositionEnd);
    setCursorPosition(cursorPositionStart, cursorPositionEnd);
    setMdText(inputText);
  };

  const cancelButton = (
    isOn,
    inputText,
    cursorPositionStart,
    cursorPositionEnd,
    cursorIntON,
    output
  ) => {
    if (
      isOn &&
      inputText.slice(
        cursorPositionStart - cursorIntON,
        cursorPositionStart - cursorIntON + output.length
      ) === output
    ) {
      inputText =
        inputText.slice(0, cursorPositionStart - cursorIntON) +
        inputText.slice(cursorPositionStart - cursorIntON + output.length);
      cursorPositionEnd = cursorPositionStart -= cursorIntON;
      return {
        cancel: true,
        inputText,
        cursorPositionStart,
        cursorPositionEnd,
      };
    } else {
      return {
        cancel: false,
        inputText,
        cursorPositionStart,
        cursorPositionEnd,
      };
    }
  };

  const bold = (
    isOn,
    inputText,
    cursorPositionStart,
    cursorPositionEnd,
    cursorIntON,
    cursorIntOFF,
    output
  ) => {
    if (!isOn) {
      inputText =
        inputText.slice(0, cursorPositionStart) +
        output +
        inputText.slice(cursorPositionStart);

      cursorPositionStart += cursorIntON;
      cursorPositionEnd += cursorIntON;
      return {
        inputText,
        cursorPositionStart,
        cursorPositionEnd,
      };
    } else if (isOn) {
      cursorPositionStart += cursorIntOFF;
      cursorPositionEnd += cursorIntOFF;

      return { inputText, cursorPositionStart, cursorPositionEnd };
    }
  };

  const newHandleButtonClick = (button) => {
    editorRef.current.focus();
    setButton((prevState) => ({ ...prevState, [button]: !isButtonOn[button] }));
    switch (button) {
      case "bold":
        cursorIntON = emphasis[0].cursorIntON;
        cursorIntOFF = emphasis[0].cursorIntOFF;
        output = emphasis[0].output;

        cancelResults = cancelButton(
          isButtonOn[button],
          inputText,
          cursorPositionStart,
          cursorPositionEnd,
          cursorIntON,
          output
        );
        if (cancelResults.cancel) {
          setChanges(
            cancelResults.inputText,
            cancelResults.cursorPositionStart,
            cancelResults.cursorPositionEnd
          );
          break;
        }

        results = bold(
          isButtonOn[button],
          inputText,
          cursorPositionStart,
          cursorPositionEnd,
          cursorIntON,
          cursorIntOFF,
          output
        );

        setChanges(
          results.inputText,
          results.cursorPositionStart,
          results.cursorPositionEnd
        );
        break;
      case "italic":
        cursorIntON = emphasis[1].cursorIntON;
        cursorIntOFF = emphasis[1].cursorIntOFF;
        output = emphasis[1].output;

        cancelResults = cancelButton(
          isButtonOn[button],
          inputText,
          cursorPositionStart,
          cursorPositionEnd,
          cursorIntON,
          output
        );
        if (cancelResults.cancel) {
          setChanges(
            cancelResults.inputText,
            cancelResults.cursorPositionStart,
            cancelResults.cursorPositionEnd
          );
          break;
        }

        results = bold(
          isButtonOn[button],
          inputText,
          cursorPositionStart,
          cursorPositionEnd,
          cursorIntON,
          cursorIntOFF,
          output
        );

        setChanges(
          results.inputText,
          results.cursorPositionStart,
          results.cursorPositionEnd
        );
        break;
      default:
        alert("default");
    }
  };
  return (
    <>
      <div className="ui icon buttons emphasis">
        {emphasis.map((element, index) => (
          <CPButton
            key={"element" + index}
            buttonTitle={element.buttonTitle}
            icon={element.icon}
            title={element.title}
            onButtonClick={newHandleButtonClick}
            shortcutKey={element.shortcut}
          />
        ))}
      </div>
    </>
  );
};

export { Buttons };
