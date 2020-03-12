import React from "react";
import { GlobalHotKeys, configure } from "react-hotkeys";

// konfigurerer HotKeys-React
configure({
  ignoreTags: []
});

const MDTextArea = props => {
  return (
    <GlobalHotKeys handlers={props.handlers} keyMap={props.keyMap}>
      <textarea
        autoFocus
        ref={props.editorRef}
        className="TextArea"
        value={props.textValue}
        onChange={event => props.onInputChange(event)}
        onKeyDown={event => props.onTextareaKeyDown(event)}
        onKeyUp={event => props.onTextareaKeyUp(event)}
        onClick={event => props.onTextareaClick(event)}
      />
    </GlobalHotKeys>
  );
};

export default MDTextArea;
