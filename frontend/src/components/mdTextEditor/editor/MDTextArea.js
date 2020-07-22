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
    console.log(
      "button : " + button + "\n buttonValues : " + buttonValues.bold
    );

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
    // emphasis
    BOLD: () => {
      editorRef.current.focus();
      setButtonValues((prevState) => ({
        ...prevState,
        bold: !buttonValues["bold"],
      }));
      testings();
      setEmphasis("bold", 2, 2, "****");
    },
    // ITALIC: () =>
    //   newHandleButtonClick(
    //     emphasis[1].buttonTitle,
    //     emphasis[1].output,
    //     emphasis[1].cursorIntON,
    //     emphasis[1].cursorIntOFF,
    //     emphasis[1].endOutput
    //   ),
    // HEADING: () =>
    //   newHandleButtonClick(
    //     emphasis[2].buttonTitle,
    //     emphasis[2].output,
    //     emphasis[2].cursorIntON,
    //     emphasis[2].cursorIntOFF,
    //     emphasis[2].endOutput
    //   ),
    // STRIKETHROUGH: () =>
    //   newHandleButtonClick(
    //     emphasis[3].buttonTitle,
    //     emphasis[3].output,
    //     emphasis[3].cursorIntON,
    //     emphasis[3].cursorIntOFF,
    //     emphasis[3].endOutput
    //   )
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
