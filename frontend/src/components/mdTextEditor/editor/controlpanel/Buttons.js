import React, { useState } from "react";
import CPButton from "./CPButton";

import editorButtonsValue from "../editorButtonsValue";

import { emphasis as emphasisConfig } from "../../settingsFiles/buttonConfig";

import { emphasis } from "./emphasis";

let undo = [""];
let undoCursorPosition = [];
let redo = [];
let redoCursorPosition = [];

const Buttons = ({
  editorRef,
  inputText,
  cursorPositionStart,
  cursorPositionEnd,
  setMdText,
  setCursorPosition,
}) => {
  let [isButtonOn, setButton] = useState(editorButtonsValue);

  const setUndo = (inputText, cursorPositionStart) => {
    if (
      undo[undo.length - 1] !== inputText &&
      undoCursorPosition !== cursorPositionStart
    ) {
      undo.push(inputText);
      undoCursorPosition.push(cursorPositionStart);
    }
  };

  const newHandleButtonClick = (button) => {
    setButton((prevState) => ({ ...prevState, [button]: !isButtonOn[button] }));
    console.log(isButtonOn);
    switch (button) {
      case "bold":
        let boldResults = emphasis(
          isButtonOn.bold,
          inputText,
          cursorPositionStart,
          cursorPositionEnd,
          emphasisConfig.bold.output,
          emphasisConfig.bold.cursorIntON,
          emphasisConfig.bold.cursorIntOFF
        );
        setMdText(boldResults.inputText);
        setUndo(boldResults.inputText, boldResults.cursorPositionStart);
        setCursorPosition(
          boldResults.cursorPositionStart,
          boldResults.cursorPositionEnd
        );
        editorRef.current.focus();
        break;
      case "italic":
        let italicResults = emphasis(
          isButtonOn.italic,
          inputText,
          cursorPositionStart,
          cursorPositionEnd
        );
        setMdText(italicResults.inputText);
        setUndo(italicResults.inputText, italicResults.cursorPositionStart);
        setCursorPosition(
          italicResults.cursorPositionStart,
          italicResults.cursorPositionEnd
        );
        editorRef.current.focus();
        break;
      default:
        Object.keys(emphasisConfig).map((element) =>
          console.log(emphasisConfig[element].buttonTitle)
        );
        alert("default");
    }
  };
  return (
    <>
      <div className="ui icon buttons emphasis">
        {Object.keys(emphasisConfig).map((element, index) => (
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

export default Buttons;
