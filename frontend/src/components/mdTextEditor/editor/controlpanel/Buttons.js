import React, { useState } from "react";
import CPButton from "./CPButton";

import editorButtonsValue from "../editorButtonsValue";

import { emphasis } from "../../settingsFiles/buttonConfig";

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

  const newHandleButtonClick = (button) => {
    editorRef.current.focus();
    setButton((prevState) => ({ ...prevState, [button]: !isButtonOn[button] }));
    switch (button) {
      case "bold":
        const cursorIntON = emphasis[0].cursorIntON;
        const cursorIntOFF = emphasis[0].cursorIntOFF;
        const output = emphasis[0].output;

        // cancel button value if pressed second time without textinput
        if (
          isButtonOn[button] &&
          inputText.slice(
            cursorPositionStart - cursorIntON,
            cursorPositionStart - cursorIntON + output.length
          ) === output
        ) {
          setButton((prevState) => ({
            ...prevState,
            [button]: !isButtonOn[button],
          }));
          inputText =
            inputText.slice(0, cursorPositionStart - cursorIntON) +
            inputText.slice(cursorPositionStart - cursorIntON + output.length);
          setChanges(
            inputText,
            cursorPositionStart - cursorIntON,
            cursorPositionEnd - cursorIntON
          );
          setCursorPosition(cursorPositionStart, cursorPositionStart);
          return;
        }
        if (!isButtonOn[button]) {
          console.log("på");
          console.log(inputText);
          inputText =
            inputText.slice(0, cursorPositionStart) +
            "****" +
            inputText.slice(cursorPositionStart);

          setChanges(
            inputText,
            cursorPositionStart + 2,
            cursorPositionStart + 2
          );
        } else if (isButtonOn[button]) {
          console.log("av");
          setChanges(inputText, cursorPositionStart + 2, cursorPositionEnd + 2);
          break;
        }
        break;
      case "italic":
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
