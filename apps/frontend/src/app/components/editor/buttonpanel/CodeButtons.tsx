import { ButtonComponent } from "./ButtonComponent";
import { codebuttons as config, KEY_COMBINATIONS as KEY } from "./settings/buttonConfig";
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
  course,
  courseTitle,
}) => {
  return (
    <>
      {Object.entries(config).map((element, index) => (
        <ButtonComponent
          key={"element" + index}
          editorRef={editorRef}
          isON={buttonValues[element[1].buttonTitle]}
          title={element[1].title}
          buttonTitle={element[1].buttonTitle}
          shortcutKey={element[1].shortcut}
          style={element[1].style}
          imageurl={""}
          icon={""}
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
        />
      ))}
    </>
  );
};

export default CodeButtons;
