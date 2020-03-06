import React from "react";
import { GlobalHotKeys, configure } from "react-hotkeys";

// konfigurerer HotKeys-React
configure({
  ignoreTags: []
});

const MDTextArea = props => {
  return (
    <GlobalHotKeys handlers={props.handlers} keyMap={props.keyMap} allowChanges>
      <textarea
        autoFocus
        ref={props.editorRef}
        className="TextArea"
        value={props.textValue}
        onChange={e => props.onInputChange(e.target.value)}
        onKeyDown={e => props.onTextareaKeyDown(e)}
        onKeyUp={e => props.onTextareaKeyUp}
      />
    </GlobalHotKeys>
  );
};

export default MDTextArea;
