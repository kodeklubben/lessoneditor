import { ButtonComponent } from "./ButtonComponent";
import { RefObject } from "react";
import { sections as config } from "./settings/buttonConfig";
import { FC } from "react";

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
        />
      ))}
    </>
  );
};

export default Sections;
