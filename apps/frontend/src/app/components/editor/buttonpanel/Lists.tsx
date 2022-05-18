import { ButtonController } from "./buttoncontroller/ButtonController";
import { lists as config } from "./buttoncontroller/settings/buttonConfig";
import { FC, RefObject } from "react";

interface ListsProps {
  editorRef: RefObject<HTMLTextAreaElement>;
  cursorPositionStart: number;
  cursorPositionEnd: number;
  mdText: string;
  buttonValues: Record<string, boolean>;
  setMdText: React.Dispatch<React.SetStateAction<string>>;
  setCursorPosition: (positionStart: number, positionEnd: number) => void;
  setCursor: (pos1: number, pos2: number) => void;
  setListButtonValues: React.Dispatch<
    React.SetStateAction<{ bTitle: string; output: string; cursorInt: number }>
  >;
  setButtonValues: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  setUndoAndUndoPosition: (mdText: string, position: number) => void;
}

const Lists: FC<ListsProps> = ({
  editorRef,
  cursorPositionStart,
  cursorPositionEnd,
  mdText,
  buttonValues,
  setMdText,
  setCursorPosition,
  setCursor,
  setListButtonValues,
  setButtonValues,
  setUndoAndUndoPosition,
}) => {
  return (
    <div className="lists_button_group">
      {Object.entries(config).map((element) => (
        <ButtonController
          key={element[1].slug}
          editorRef={editorRef}
          isON={buttonValues[element[1].slug]}
          title={element[1].title}
          buttonSlug={element[1].slug}
          shortcutKey={element[1].shortcut}
          icon={element[1].icon}
          setButtonValues={setButtonValues}
          setListButtonValues={setListButtonValues}
          setCursor={setCursor}
          setCursorPosition={setCursorPosition}
          setMdText={setMdText}
          cursorIntON={element[1].cursorIntON}
          cursorIntOFF={element[1].cursorIntOFF}
          output={element[1].output}
          mdText={mdText}
          cursorPositionStart={cursorPositionStart}
          cursorPositionEnd={cursorPositionEnd}
          outputOnEnter={element[1].outputOnEnter}
          setUndoAndUndoPosition={setUndoAndUndoPosition}
        />
      ))}
    </div>
  );
};

export default Lists;
