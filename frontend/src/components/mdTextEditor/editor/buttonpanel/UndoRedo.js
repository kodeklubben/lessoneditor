import React from "react";
import CPButton from "./CPButton";

import { useHotkeys } from "react-hotkeys-hook";

import {
  KEY_COMBINATIONS as KEY,
  undoRedo as config,
} from "../../settingsFiles/buttonConfig";

let position;

const UndoRedo = ({
  editorRef,
  mdText,
  undo,
  redo,
  cursorPositionStart,
  undoCursorPosition,
  redoCursorPosition,
  setUndoCursorPosition,
  setRedoCursorPosition,
  pushUndoValue,
  pushRedoValue,

  setCursorPosition,
}) => {
  const set = {
    undo: () => {
      if (undoCursorPosition.length > 0) {
        position = undoCursorPosition[undoCursorPosition.length - 1];
        setUndoCursorPosition(
          undoCursorPosition.slice(0, undoCursorPosition.length - 1)
        );
      }
      if (undo.length <= 0) {
        return;
      }

      pushRedoValue(mdText, cursorPositionStart);
      setCursorPosition(position, position);
    },
    redo: () => {
      if (redoCursorPosition.length > 0) {
        position = redoCursorPosition[redoCursorPosition.length - 1];
        setRedoCursorPosition(
          redoCursorPosition.slice(0, redoCursorPosition.length - 1)
        );
      }
      if (redo.length <= 0) {
        return;
      }
      pushUndoValue(mdText, cursorPositionStart);
      setCursorPosition(position, position);
    },
  };
  useHotkeys(
    `${KEY.undo}, ${KEY.redo}`,
    (event, handler) => {
      event.preventDefault();
      switch (handler.key) {
        case KEY.undo:
          set.undo();
          break;
        case KEY.redo:
          set.redo();
          break;
        default:
          break;
      }
      return false;
    },
    { enableOnTags: "TEXTAREA", keydown: true },
    [pushUndoValue, pushRedoValue]
  );

  const handleButtonClick = (button) => {
    editorRef.current.focus();
    switch (button) {
      case config.undo.buttonTitle:
        set.undo();
        break;
      case config.redo.buttonTitle:
        set.redo();
        break;
      default:
        break;
    }
  };
  return (
    <>
      <div className="ui icon buttons emphasis">
        {Object.entries(config).map((element, index) => (
          <CPButton
            key={"element" + index}
            buttonTitle={element[1].buttonTitle}
            icon={element[1].icon}
            title={element[1].title}
            onButtonClick={handleButtonClick}
            shortcutKey={element[1].shortcut}
          />
        ))}
      </div>
    </>
  );
};

export default UndoRedo;
