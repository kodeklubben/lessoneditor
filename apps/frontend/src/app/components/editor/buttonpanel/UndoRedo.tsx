import ButtonComponent from "./ButtonComponent";

import { useHotkeys } from "react-hotkeys-hook";

import { KEY_COMBINATIONS as KEY, undoRedo as config } from "./settings/buttonConfig";
import { FC } from "react";

let position: any;

const UndoRedo: FC<any> = ({
  editorRef,
  mdText,
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
        setUndoCursorPosition(undoCursorPosition.slice(0, undoCursorPosition.length - 1));
      } else {
        return;
      }

      pushRedoValue(mdText, cursorPositionStart);
      setCursorPosition(position, position);
    },
    redo: () => {
      if (redoCursorPosition.length > 0) {
        position = redoCursorPosition[redoCursorPosition.length - 1];
        setRedoCursorPosition(redoCursorPosition.slice(0, redoCursorPosition.length - 1));
      } else {
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
    { enableOnTags: ["TEXTAREA"], keydown: true },
    [pushUndoValue, pushRedoValue]
  );

  const handleButtonClick = (button: any) => {
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
    <div>
      {Object.entries(config).map((element, index) => (
        <ButtonComponent
          key={"element" + index}
          buttonValues={{}}
          icon={element[1].icon}
          title={element[1].title}
          onButtonClick={handleButtonClick}
          buttonTitle={element[1].buttonTitle}
          shortcutKey={element[1].shortcut}
          style={{}}
          imageurl=""
        />
      ))}
    </div>
  );
};

export default UndoRedo;
