import React, { useState } from "react";
import { GlobalHotKeys, configure } from "react-hotkeys";
import { keyMap } from "./buttonpanel/utils/textAreaMethods";

import {
  cancelButton,
  buttonAction,
  heading,
} from "./buttonpanel/utils/buttonMethods";

let output;
let cancelResults;
let results;

configure({
  ignoreTags: [],
});

const MDTextArea = ({
  isKeyShortcutOn,
  setKeyShortcutOn,
  editorRef,
  mdText,
  onInputChange,
  onTextareaKeyDown,
  onTextareaKeyUp,
  onTextareaMouseDown,
  onTextareaSelect,
  cursorPositionStart,
  cursorPositionEnd,
  setMdText,
  setCursorPosition,
  setCursor,
}) => {
  let [update, setUpdate] = useState("test");

  const setChanges = (mdText, cursorPositionStart, cursorPositionEnd) => {
    setCursor(cursorPositionStart, cursorPositionEnd);
    setCursorPosition(cursorPositionStart, cursorPositionEnd);
    setMdText(mdText);
  };

  const setEmphasis = (button, cursorIntON, cursorIntOFF, output) => {
    setUpdate("bajs");
    console.log(update);
    cancelResults = cancelButton(
      isKeyShortcutOn[button],
      mdText,
      cursorPositionStart,
      cursorPositionEnd,
      cursorIntON,
      output
    );
    if (cancelResults.cancel) {
      alert("");
      setChanges(
        cancelResults.mdText,
        cancelResults.cursorPositionStart,
        cancelResults.cursorPositionEnd
      );
      return;
    }

    results = buttonAction(
      isKeyShortcutOn[button],
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
    BOLD: () => {
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
