import "./buttonpanel_smalldevices.scss";
import { Dispatch, SetStateAction, FC, RefObject } from "react";
import Emphasis from "./Emphasis";
import Sections from "./Sections";
import CodeButtons from "./CodeButtons";
import Preview from "./Preview";
import MicrobitButtons from "./MicrobitButtons";
import SratchButtons from "./ScratchButtons";

interface ButtonPanel_SmallDevicesProps {
  buttonValues: Record<string, boolean>;
  course: string;
  courseTitle: string;
  cursorPositionStart: number;
  cursorPositionEnd: number;
  editorRef: RefObject<HTMLTextAreaElement>;
  mdText: string;
  setButtonValues: Dispatch<SetStateAction<Record<string, boolean>>>;
  setCursor: (pos1: number, pos2: number) => void;
  setCursorPosition: (positionStart: number, positionEnd: number) => void;
  setMdText: Dispatch<SetStateAction<string>>;
  setUndoAndUndoPosition: (mdText: string, position: number) => void;
  setPreview: Dispatch<SetStateAction<boolean>>;
}

const ButtonPanel_SmallDevices: FC<ButtonPanel_SmallDevicesProps> = ({
  buttonValues,
  course,
  courseTitle,
  cursorPositionStart,
  cursorPositionEnd,
  editorRef,
  mdText,
  setButtonValues,
  setCursor,
  setCursorPosition,
  setMdText,
  setUndoAndUndoPosition,
  setPreview,
}) => {
  return (
    <>
      <div className="buttonpanel_small_devices">
        <div className="bottom_panel">
          <div
            className={`scratchmicrobit_row ${
              course === "microbit" || course === "scratch" ? "active" : ""
            }`}
          >
            {course === "microbit" && (
              <MicrobitButtons
                editorRef={editorRef}
                cursorPositionStart={cursorPositionStart}
                cursorPositionEnd={cursorPositionEnd}
                mdText={mdText}
                buttonValues={buttonValues}
                setMdText={setMdText}
                setCursorPosition={setCursorPosition}
                setCursor={setCursor}
                setButtonValues={setButtonValues}
                setUndoAndUndoPosition={setUndoAndUndoPosition}
              />
            )}
            {course === "scratch" && (
              <SratchButtons
                editorRef={editorRef}
                cursorPositionStart={cursorPositionStart}
                cursorPositionEnd={cursorPositionEnd}
                mdText={mdText}
                buttonValues={buttonValues}
                setMdText={setMdText}
                setCursorPosition={setCursorPosition}
                setCursor={setCursor}
                setButtonValues={setButtonValues}
                setUndoAndUndoPosition={setUndoAndUndoPosition}
              />
            )}
          </div>
          <div className="codebuttons_row">
            <Sections
              editorRef={editorRef}
              cursorPositionStart={cursorPositionStart}
              cursorPositionEnd={cursorPositionEnd}
              mdText={mdText}
              buttonValues={buttonValues}
              setMdText={setMdText}
              setCursorPosition={setCursorPosition}
              setCursor={setCursor}
              setButtonValues={setButtonValues}
              setUndoAndUndoPosition={setUndoAndUndoPosition}
            />
            <CodeButtons
              editorRef={editorRef}
              mdText={mdText}
              cursorPositionStart={cursorPositionStart}
              cursorPositionEnd={cursorPositionEnd}
              buttonValues={buttonValues}
              setMdText={setMdText}
              setCursorPosition={setCursorPosition}
              setCursor={setCursor}
              setButtonValues={setButtonValues}
              course={course}
              courseTitle={courseTitle}
              setUndoAndUndoPosition={setUndoAndUndoPosition}
            />
          </div>
          <div className="textbuttons_row">
            <Emphasis
              editorRef={editorRef}
              mdText={mdText}
              buttonValues={buttonValues}
              cursorPositionStart={cursorPositionStart}
              cursorPositionEnd={cursorPositionEnd}
              setMdText={setMdText}
              setCursorPosition={setCursorPosition}
              setCursor={setCursor}
              setButtonValues={setButtonValues}
              setUndoAndUndoPosition={setUndoAndUndoPosition}
            />
            <Preview editorRef={editorRef} setPreview={setPreview} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ButtonPanel_SmallDevices;
