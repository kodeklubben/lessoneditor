import React from "react";

const MDTextArea = props => {
  return (
    <textarea
      autoFocus
      ref={props.editorRef}
      className="TextArea"
      value={props.textValue}
      onChange={e => props.onInputChange(e.target.value)}
      onKeyDown={e => props.onTextareaKeyDown(e)}
    />
  );
};

export default MDTextArea;
