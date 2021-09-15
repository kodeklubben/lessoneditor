import { ButtonController } from "./buttoncontroller/ButtonController";
import { emphasis as config } from "./buttoncontroller/settings/buttonConfig";
import { FC, RefObject } from "react";

interface EmphasisProps {
  editorRef: RefObject<HTMLTextAreaElement>;
  mdText: string;
  buttonValues: Record<string, boolean>;
  cursorPositionStart: number;
  cursorPositionEnd: number;
  setMdText: React.Dispatch<React.SetStateAction<string>>;
  setCursorPosition: (positionStart: number, positionEnd: number) => void;
  setCursor: (pos1: number, pos2: number) => void;
  setButtonValues: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  pushUndoValue: (mdText: string, cursorPositionStart: number) => void;
}

const Emphasis: FC<EmphasisProps> = ({
  editorRef,
  mdText,
  buttonValues,
  cursorPositionStart,
  cursorPositionEnd,
  setMdText,
  setCursorPosition,
  setCursor,
  setButtonValues,
  pushUndoValue,
}) => {
  return (
    <div>
      {Object.entries(config).map((element, index) => {
        return (
          <ButtonController
            key={"element" + index}
            editorRef={editorRef}
            isON={buttonValues[element[1].buttonTitle]}
            title={element[1].title}
            buttonTitle={element[1].buttonTitle}
            shortcutKey={element[1].shortcut}
            icon={element[1].icon}
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
            pushUndoValue={pushUndoValue}
          />
        );
      })}
    </div>
  );
};

export default Emphasis;
