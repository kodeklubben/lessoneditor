import React from "react";

const MDTextArea = ({
  editorRef,
  mdText,
  onInputChange,
  onTextareaKeyDown,
  onTextareaKeyUp,
  onTextareaMouseDown,
  onTextareaSelect,
}) => {
  return (
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
  );
};

export default MDTextArea;
