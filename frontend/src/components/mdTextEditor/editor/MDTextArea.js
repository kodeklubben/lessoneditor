import React from "react";
import { GlobalHotKeys, configure } from "react-hotkeys";

// konfigurerer HotKeys-React
configure({
  ignoreTags: [],
});

const MDTextArea = (props) => {
  return (
    <GlobalHotKeys handlers={props.handlers} keyMap={props.keyMap}>
      <textarea
        autoFocus
        ref={props.editorRef}
        className="TextArea"
        value={props.mdText}
        onChange={(event) => props.onInputChange(event)}
        onKeyDown={(event) => props.onTextareaKeyDown(event)}
        onKeyUp={(event) => props.onTextareaKeyUp(event)}
        onMouseDown={(event) => props.onTextareaMouseDown(event)}
        onTouchEnd={(event) => props.onTextareaMouseDown(event)}
        onSelect={(event) => props.onTextareaSelect(event)}
        onWheel={(event) => props.onTextareaMouseDown(event)}
      />
    </GlobalHotKeys>
  );
};

export default MDTextArea;
