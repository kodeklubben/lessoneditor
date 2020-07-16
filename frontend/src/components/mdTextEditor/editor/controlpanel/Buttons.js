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

  const setChanges = (results) => {
    setMdText(results.inputText);
    setUndo(results.inputText, results.cursorPositionStart);
    setCursorPosition(results.cursorPositionStart, results.cursorPositionEnd);
    console.log("results " + results.cursorPositionStart);
  };

  const ifNewLine = (inputText) => {
    return (
      inputText[cursorPositionStart - 1] === "\n" ||
      inputText === "" ||
      cursorPositionStart === 0
    );
  };

  const heading = (
    isButtonOn,
    inputText,
    cursorPositionStart,
    cursorPositionEnd,
    output,
    cursorIntON,
    cursorIntOFF,
    setButton
  ) => {
    // Give heading button multiple values
    if (
      ifNewLine(inputText, cursorPositionStart) ||
      inputText.slice(cursorPositionStart - 3, cursorPositionStart) === "## " ||
      inputText.slice(cursorPositionStart - 2, cursorPositionStart) === "# "
        ? true
        : false
    ) {
      if (
        output === "## " &&
        inputText.slice(cursorPositionStart - 3, cursorPositionStart) ===
          output &&
        !isButtonOn
      ) {
        alert("1");
        setUndo();
        inputText =
          inputText.slice(0, cursorPositionStart - 3) +
          "# " +
          inputText.slice(cursorPositionStart);

        cursorPositionStart -= 1;
        return { inputText, cursorPositionStart };
      } else if (output === "## " && !isButtonOn) {
        alert("2");
        setUndo();
        inputText =
          inputText.slice(0, cursorPositionStart) +
          output +
          inputText.slice(cursorPositionStart);

        cursorPositionStart += output.length;

        return { inputText, cursorPositionStart };
      } else if (output === "## " && isButtonOn) {
        alert("3");
        if (
          inputText.slice(cursorPositionStart - 2, cursorPositionStart) === "# "
        ) {
          alert("4");
          setUndo();
          inputText =
            inputText.slice(0, cursorPositionStart - 2) +
            inputText.slice(cursorPositionStart);
          cursorPositionStart -= 2;
          setButton((prevState) => ({ ...prevState, [heading]: !isButtonOn }));
          return { inputText, cursorPositionStart };
        } else {
          alert("5");
          setButton((prevState) => ({ ...prevState, [heading]: !isButtonOn }));
          return { inputText, cursorPositionStart };
        }
      }
    } else {
      alert("her ass");
    }
  };

  const newHandleButtonClick = (button) => {
    setButton((prevState) => ({ ...prevState, [button]: !isButtonOn[button] }));
    editorRef.current.focus();

    switch (button) {
      case "bold":
        let boldResults = emphasis(
          isButtonOn.bold,
          inputText,
          cursorPositionStart,
          cursorPositionEnd,
          emphasisConfig[0].output,
          emphasisConfig[0].cursorIntON,
          emphasisConfig[0].cursorIntOFF
        );
        setChanges(boldResults);
        break;
      case "italic":
        let italicResults = emphasis(
          isButtonOn.italic,
          inputText,
          cursorPositionStart,
          cursorPositionEnd,
          emphasisConfig[1].output,
          emphasisConfig[1].cursorIntON,
          emphasisConfig[1].cursorIntOFF
        );
        setChanges(italicResults);
        break;
      case "heading":
        let headingResults = heading(
          isButtonOn.heading,
          inputText,
          cursorPositionStart,
          cursorPositionEnd,
          emphasisConfig[2].output,
          emphasisConfig[2].cursorIntON,
          emphasisConfig[2].cursorIntOFF,
          setButton
        );
        setChanges(headingResults);
        break;
      default:
        alert("default");
    }
  };
  return (
    <>
      <div className="ui icon buttons emphasis">
        {emphasisConfig.map((element, index) => (
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
