import { ButtonController } from "./buttoncontroller/ButtonController";
import { codebuttons as config } from "./buttoncontroller/settings/buttonConfig";
import { FC, RefObject } from "react";

export interface CodeButtonsProps {
  editorRef: RefObject<HTMLTextAreaElement>;
  mdText: string;
  cursorPositionStart: number;
  cursorPositionEnd: number;
  buttonValues: Record<string, boolean>;
  setMdText: React.Dispatch<React.SetStateAction<string>>;
  setCursorPosition: (positionStart: number, positionEnd: number) => void;
  setCursor: (pos1: number, pos2: number) => void;
  setButtonValues: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  course: string;
  courseTitle: string;
  setUndoAndUndoPosition: (mdText: string, position: number) => void;
}

const CodeButtons: FC<CodeButtonsProps> = ({
  editorRef,
  mdText,
  cursorPositionStart,
  cursorPositionEnd,
  buttonValues,
  setMdText,
  setCursorPosition,
  setCursor,
  setButtonValues,
  setUndoAndUndoPosition,
  course,
  courseTitle,
}) => {
  return (
    <>
      {Object.entries(config).map((element) => (
        <ButtonController
          key={element[1].slug}
          editorRef={editorRef}
          isON={buttonValues[element[1].slug]}
          title={element[1].title}
          buttonSlug={element[1].slug}
          shortcutKey={element[1].shortcut}
          style={element[1].style}
          setButtonValues={setButtonValues}
          setCursor={setCursor}
          setCursorPosition={setCursorPosition}
          setMdText={setMdText}
          cursorIntON={element[1].cursorIntON}
          cursorIntOFF={element[1].cursorIntOFF}
          output={element[1].output}
          mdText={mdText}
          cursorPositionStart={cursorPositionStart}
          cursorPositionEnd={cursorPositionEnd}
          course={course}
          courseTitle={courseTitle}
          setUndoAndUndoPosition={setUndoAndUndoPosition}
        />
      ))}
    </>
  );
};

export default CodeButtons;
