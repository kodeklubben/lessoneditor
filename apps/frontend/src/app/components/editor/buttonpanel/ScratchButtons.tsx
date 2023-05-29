import { ButtonController } from "./buttoncontroller/ButtonController";

import { scratchbuttons as config } from "./buttoncontroller/settings/microbitAndScratchButtonConfig";
import { FC, RefObject } from "react";

interface ScratchButtonsProps {
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

const ScratchButtons: FC<ScratchButtonsProps> = ({
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
          color={element[1].color}
          setUndoAndUndoPosition={setUndoAndUndoPosition}
        />
      ))}
    </>
  );
};

export default ScratchButtons;
