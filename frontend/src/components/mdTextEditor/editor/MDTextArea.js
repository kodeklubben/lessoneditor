import React from "react";
import { GlobalHotKeys, configure } from "react-hotkeys";
import { keyMap } from "./buttonpanel/utils/textAreaMethods";
import {
  cancelButton,
  buttonAction as emphasisAction,
} from "../editor/buttonpanel/utils/buttonMethods";

configure({
  ignoreTags: [],
});

let cancelResults;
let results;

const MDTextArea = ({
  testings,
  editorRef,
  cursorPositionStart,
  cursorPositionEnd,
  mdText,
  buttonValues,
  setMdText,
  setCursorPosition,
  setCursor,
  setButtonValues,
  onInputChange,
  onTextareaKeyDown,
  onTextareaKeyUp,
  onTextareaMouseDown,
  onTextareaSelect,
}) => {
  const setChanges = (mdText, cursorPositionStart, cursorPositionEnd) => {
    setCursor(cursorPositionStart, cursorPositionEnd);
    setCursorPosition(cursorPositionStart, cursorPositionEnd);
    setMdText(mdText);
  };

  const setEmphasis = (button, cursorIntON, cursorIntOFF, output) => {
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
        cancelResults.inputText,
        cancelResults.cursorPositionStart,
        cancelResults.cursorPositionEnd
      );
      return;
    }

    results = emphasisAction(
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

  const handlers = {
    BOLD: (a) => {
      console.log(a);
      editorRef.current.focus();
      setButtonValues((prevState) => ({
        ...prevState,
        bold: !buttonValues["bold"],
      }));

      setEmphasis("bold", 2, 2, "****");
    },
  };

  return (
    <GlobalHotKeys id="hotkeysID" handlers={handlers} keyMap={keyMap}>
      <textarea
        autoFocus
        ref={editorRef}
        className="TextArea"
        value={mdText}
        onChange={(event) => onInputChange(event)}
        onKeyDown={(event) => onTextareaKeyDown(event)}
        onKeyUp={(event) => onTextareaKeyUp(event)}
        onMouseDown={(event) => onTextareaMouseDown(event)}
        onTouchEnd={(event) => onTextareaMouseDown(event)}
        onSelect={(event) => onTextareaSelect(event)}
        onWheel={(event) => onTextareaMouseDown(event)}
      />
    </GlobalHotKeys>
  );
};

export default MDTextArea;
