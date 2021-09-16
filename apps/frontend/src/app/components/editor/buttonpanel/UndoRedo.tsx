import { ButtonController } from "./buttoncontroller/ButtonController";
import { undoRedo as config } from "./buttoncontroller/settings/buttonConfig";
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
  return (
    <div>
      {Object.entries(config).map((element, index) => (
        <ButtonController
          key={"element" + index}
          editorRef={editorRef}
          isON={false}
          title={element[1].title}
          buttonTitle={element[1].slug}
          shortcutKey={element[1].shortcut}
          icon={element[1].icon}
          cursorIntON={0}
          cursorIntOFF={0}
          output={"element[1].output"}
          mdText={mdText}
          setCursorPosition={setCursorPosition}
          cursorPositionStart={cursorPositionStart}
          cursorPositionEnd={0}
          undoCursorPosition={undoCursorPosition}
          redoCursorPosition={redoCursorPosition}
          setUndoCursorPosition={setUndoCursorPosition}
          setRedoCursorPosition={setRedoCursorPosition}
          pushUndoValue={pushUndoValue}
          pushRedoValue={pushRedoValue}
        />
      ))}
    </div>
  );
};

export default UndoRedo;
