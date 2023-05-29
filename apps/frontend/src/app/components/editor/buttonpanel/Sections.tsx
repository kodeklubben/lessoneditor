import { ButtonController } from "./buttoncontroller/ButtonController";
import { FC, RefObject } from "react";
import { sections as config } from "./buttoncontroller/settings/buttonConfig";

interface SectionsProps {
  editorRef: RefObject<HTMLTextAreaElement>;
  cursorPositionStart: number;
  cursorPositionEnd: number;
  mdText: string;
  buttonValues: Record<string, boolean>;
  setMdText: React.Dispatch<React.SetStateAction<string>>;
  setCursorPosition: (positionStart: number, positionEnd: number) => void;
  setCursor: (pos1: number, pos2: number) => void;
  setButtonValues: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  setUndoAndUndoPosition: (mdText: string, position: number) => void;
}

const Sections: FC<SectionsProps> = ({
  editorRef,
  cursorPositionStart,
  cursorPositionEnd,
  mdText,
  buttonValues,
  setMdText,
  setCursorPosition,
  setCursor,
  setButtonValues,
  setUndoAndUndoPosition,
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
          imageurl={element[1].imageurl ? element[1].imageurl : ""}
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
          setUndoAndUndoPosition={setUndoAndUndoPosition}
        />
      ))}
    </>
  );
};

export default Sections;
