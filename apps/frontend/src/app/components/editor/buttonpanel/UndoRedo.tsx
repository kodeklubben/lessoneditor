import { TestButtonComponent } from "./ButtonComponent";
import { useHotkeys } from "react-hotkeys-hook";
import { KEY_COMBINATIONS as KEY, undoRedo as config } from "./settings/buttonConfig";
import { FC, RefObject } from "react";

interface UndoRedoProps {
  editorRef: RefObject<HTMLTextAreaElement>;
  mdText: string;
  cursorPositionStart: number;
  undoCursorPosition: number[];
  redoCursorPosition: number[];
  setUndoCursorPosition: React.Dispatch<React.SetStateAction<number[]>>;
  setRedoCursorPosition: React.Dispatch<React.SetStateAction<number[]>>;
  pushUndoValue: (mdText: string, cursorPositionStart: number) => void;
  pushRedoValue: (mdText: string, cursorPositionStart: number) => void;
  setCursorPosition: (positionStart: number, positionEnd: number) => void;
}

const UndoRedo: FC<UndoRedoProps> = ({
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
  const shortcuts = Object.entries(config).map((item) => item[1].shortcut);

  const set = {
    undo: () => {
      if (undoCursorPosition.length > 0) {
        const position = undoCursorPosition[undoCursorPosition.length - 1];
        setUndoCursorPosition(undoCursorPosition.slice(0, undoCursorPosition.length - 1));
        pushRedoValue(mdText, cursorPositionStart);
        setCursorPosition(position, position);
      } else {
        return;
      }
    },
    redo: () => {
      if (redoCursorPosition.length > 0) {
        const position = redoCursorPosition[redoCursorPosition.length - 1];
        setRedoCursorPosition(redoCursorPosition.slice(0, redoCursorPosition.length - 1));
        pushUndoValue(mdText, cursorPositionStart);
        setCursorPosition(position, position);
      } else {
        return;
      }
    },
  };

  useHotkeys(
    shortcuts.join(),
    (event, handler) => {
      event.preventDefault();
      const [key] = Object.keys(KEY.undoRedo).filter(
        //@ts-ignore
        (item: string) => KEY.undoRedo[item] === handler.key
      );
      //@ts-ignore
      set[key]();

      return false;
    },
    { enableOnTags: ["TEXTAREA"], keydown: true },
    [pushUndoValue, pushRedoValue]
  );

  const handleButtonClick = (button: string) => {
    editorRef.current ? editorRef.current.focus() : "";
    //@ts-ignore
    set[button]();
  };
  return (
    <div>
      {Object.entries(config).map((element, index) => (
        <TestButtonComponent
          key={"element" + index}
          isON={false}
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
