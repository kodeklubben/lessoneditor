import React from "react";
import CPButton from "./CPButton";

import { undoRedo as config } from "../../settingsFiles/buttonConfig";

let position;

const UndoRedo = ({
  editorRef,
  mdText,
  undo,
  redo,
  undoCursorPosition,
  setUndoCursorPosition,
  redoCursorPosition,
  setRedoCursorPosition,
  pushUndoValue,
  pushRedoValue,
  cursorPositionStart,
  setCursorPosition,
}) => {
  const newHandleButtonClick = (button) => {
    editorRef.current.focus();
    switch (button) {
      case "undo":
        if (undoCursorPosition.length > 0) {
          position = undoCursorPosition[undoCursorPosition.length - 1];
          setUndoCursorPosition(
            undoCursorPosition.slice(0, undoCursorPosition.length - 1)
          );
        }
        if (undo.length <= 0) {
          alert("empty");
          break;
        }
        pushRedoValue(mdText, cursorPositionStart);
        setCursorPosition(position, position);

        break;
      case "redo":
        if (redoCursorPosition.length > 0) {
          position = redoCursorPosition[redoCursorPosition.length - 1];
          setRedoCursorPosition(
            redoCursorPosition.slice(0, redoCursorPosition.length - 1)
          );
        }
        if (redo.length <= 0) {
          alert("empty REDO");
          break;
        }
        pushUndoValue(mdText, cursorPositionStart);
        setCursorPosition(position, position);

        break;
      default:
        alert("default");
    }
  };
  return (
    <>
      <div className="ui icon buttons emphasis">
        {config.map((element, index) => (
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

export default UndoRedo;
