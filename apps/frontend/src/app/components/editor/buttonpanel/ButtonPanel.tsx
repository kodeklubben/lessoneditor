import { FC, RefObject, useState } from "react";
import "./buttonpanel.scss";
import ShowSpinner from "../../ShowSpinner";
import Autosave from "../Autosave";
import Emphasis from "./Emphasis";
import UndoRedo from "./UndoRedo";
import Hyperlink from "./Hyperlink";
import Image from "./Image";
import Video from "./Video";
import Languages from "./Languages";
import Lists from "./Lists";
import Sections from "./Sections";
import CodeButton from "./CodeButton";
import MicrobitButtons from "./MicrobitButtons";
import SratchButtons from "./ScratchButtons";
import EditorDatamodal from "../datapanel/EditorDatamodal";
import SubmitButton from "./SubmitButton";

interface ButtonPanelProps {
  buttonValues: Record<string, boolean>;
  course: string;
  courseTitle: string;
  cursorPositionStart: number;
  cursorPositionEnd: number;
  editorRef: RefObject<HTMLTextAreaElement>;
  lessonTitle: string;
  mdText: string;
  pushRedoValue: (mdText: string, cursorPositionStart: number) => void;
  pushUndoValue: (mdText: string, cursorPositionStart: number) => void;
  redoCursorPosition: number[];
  saveEditorText: (regenThumb: boolean) => Promise<void>;
  setButtonValues: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  setCursor: (pos1: number, pos2: number) => void;
  setCursorPosition: (positionStart: number, positionEnd: number) => void;
  setListButtonValues: React.Dispatch<
    React.SetStateAction<{ bTitle: string; output: string; cursorInt: number }>
  >;
  setMdText: React.Dispatch<React.SetStateAction<string>>;
  setRedoCursorPosition: React.Dispatch<React.SetStateAction<number[]>>;
  setUndoCursorPosition: React.Dispatch<React.SetStateAction<number[]>>;
  undoCursorPosition: number[];
  uploadImageRef: RefObject<HTMLInputElement>;
}

const ButtonPanel: FC<ButtonPanelProps> = ({
  buttonValues,
  course,
  courseTitle,
  cursorPositionStart,
  cursorPositionEnd,
  editorRef,
  lessonTitle,
  mdText,
  pushRedoValue,
  pushUndoValue,
  redoCursorPosition,
  saveEditorText,
  setButtonValues,
  setCursor,
  setCursorPosition,
  setListButtonValues,
  setMdText,
  setRedoCursorPosition,
  setUndoCursorPosition,
  undoCursorPosition,
  uploadImageRef,
}) => {
  const [showSpinner, setShowSpinner] = useState(false);

  return (
    <>
      {showSpinner ? <ShowSpinner /> : ""}
      <div className="buttonpanel">
        <div className="firstrow">
          <div className="buttongroup">
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
            />

            <div style={{ marginRight: "3em" }} />

            <UndoRedo
              editorRef={editorRef}
              mdText={mdText}
              cursorPositionStart={cursorPositionStart}
              undoCursorPosition={undoCursorPosition}
              redoCursorPosition={redoCursorPosition}
              setUndoCursorPosition={setUndoCursorPosition}
              setRedoCursorPosition={setRedoCursorPosition}
              pushUndoValue={pushUndoValue}
              pushRedoValue={pushRedoValue}
              setCursorPosition={setCursorPosition}
            />

            <div style={{ marginRight: "3em" }} />

            <Hyperlink
              editorRef={editorRef}
              mdText={mdText}
              cursorPositionStart={cursorPositionStart}
              cursorPositionEnd={cursorPositionEnd}
              setMdText={setMdText}
              setCursorPosition={setCursorPosition}
              setCursor={setCursor}
            />

            <Image editorRef={editorRef} uploadImageRef={uploadImageRef} />
            <Video
              editorRef={editorRef}
              mdText={mdText}
              cursorPositionStart={cursorPositionStart}
              cursorPositionEnd={cursorPositionEnd}
              setMdText={setMdText}
              setCursorPosition={setCursorPosition}
              setCursor={setCursor}
            />

            <div style={{ marginRight: "3em" }} />

            <Lists
              editorRef={editorRef}
              cursorPositionStart={cursorPositionStart}
              cursorPositionEnd={cursorPositionEnd}
              mdText={mdText}
              buttonValues={buttonValues}
              setMdText={setMdText}
              setCursorPosition={setCursorPosition}
              setCursor={setCursor}
              setListButtonValues={setListButtonValues}
              setButtonValues={setButtonValues}
            />
          </div>
          <div className="settingspanel">
            <Languages saveEditorText={saveEditorText} setShowSpinner={setShowSpinner} />
            <EditorDatamodal
              courseTitle={courseTitle}
              lessonTitle={lessonTitle}
              setShowSpinner={setShowSpinner}
            />
            <SubmitButton
              mdText={mdText}
              setShowSpinner={setShowSpinner}
              saveEditorText={saveEditorText}
            />
          </div>
        </div>
        <div className="secondrow">
          <div className="sectiongroup">
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
            />

            <span style={{ marginRight: "5em" }} />

            <CodeButton
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
            />
          </div>
          <Autosave mdText={mdText} saveEditorText={saveEditorText} />
        </div>

        <div>
          {course === "microbit" ? (
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
            />
          ) : (
            ""
          )}
          {course === "scratch" ? (
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
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default ButtonPanel;
