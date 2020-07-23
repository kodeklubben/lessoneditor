import React from "react";
import { GlobalHotKeys, configure } from "react-hotkeys";
import { keyMap } from "./buttonpanel/utils/textAreaMethods";

configure({
  ignoreTags: [],
});

const MDTextArea = ({
  handlers,
  editorRef,
  mdText,
  onInputChange,
  onTextareaKeyDown,
  onTextareaKeyUp,
  onTextareaMouseDown,
  onTextareaSelect,
}) => {
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
