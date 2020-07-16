import React, { useState } from "react";
import CPButton from "./CPButton";

import editorButtonsValue from "../editorButtonsValue";

import { emphasis as emphasisConfig } from "../../settingsFiles/buttonConfig";

import { emphasis } from "./emphasis";

const cancelButton = (
  isOn,
  inputText,
  cursorPositionStart,
  cursorPositionEnd,
  cursorIntON,
  cursorIntOFF,
  output
) => {
  // cancel button value if pressed second time without textinput
  return (
    isOn &&
    inputText.slice(
      cursorPositionStart - cursorIntON,
      cursorPositionStart - cursorIntON + output.length
    ) === output
  );
};

const Buttons = ({
  editorRef,
  inputText,
  cursorPositionStart,
  cursorPositionEnd,
  setMdText,
  setCursorPosition,
  setCursor,
}) => {
  let [isButtonOn, setButton] = useState(editorButtonsValue);

  const setChanges = (inputText, cursorPositionStart, cursorPositionEnd) => {
    // setUndo(results.inputText, results.cursorPositionStart);
    setCursor(cursorPositionStart, cursorPositionEnd);
    setCursorPosition(cursorPositionStart, cursorPositionEnd);
    setMdText(inputText);
  };

  const newHandleButtonClick = (button) => {
    editorRef.current.focus();
    setButton((prevState) => ({ ...prevState, [button]: !isButtonOn[button] }));
    switch (button) {
      case "bold":
        console.log(
          true &&
            inputText.slice(
              cursorPositionStart - 2,
              cursorPositionStart - 2 + 4
            ) === "****"
        );
        console.log(
          inputText.slice(cursorPositionStart - 2, cursorPositionStart - 2 + 4)
        );
        if (
          cancelButton(
            true,
            inputText,
            cursorPositionStart,
            cursorPositionEnd,
            2,
            2,
            "****"
          )
        ) {
          alert("cancel");
        }
        let boldResults = emphasis(
          isButtonOn.bold,
          inputText,
          cursorPositionStart,
          cursorPositionEnd,
          emphasisConfig[0].output,
          emphasisConfig[0].cursorIntON,
          emphasisConfig[0].cursorIntOFF,
          setChanges
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
