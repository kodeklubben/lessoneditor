import "./buttonpanel.scss";
import { Dispatch, SetStateAction, FC, RefObject, useState } from "react";
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
import CodeButtons from "./CodeButtons";
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
  pushRedoValue: (mdText: string) => void;
  pushUndoValue: (mdText: string, cursorPositionStart: number) => void;
  undoCursorPosition: number[];
  redoCursorPosition: number[];
  saveEditorText: () => void;
  setButtonValues: Dispatch<SetStateAction<Record<string, boolean>>>;
  setCursor: (pos1: number, pos2: number) => void;
  setCursorPosition: (positionStart: number, positionEnd: number) => void;
  setListButtonValues: Dispatch<
    SetStateAction<{ bTitle: string; output: string; cursorInt: number }>
  >;
  setMdText: Dispatch<SetStateAction<string>>;
  setRedoCursorPosition: Dispatch<SetStateAction<number[]>>;
  setUndoCursorPosition: Dispatch<SetStateAction<number[]>>;
  uploadImageRef: RefObject<HTMLInputElement>;
  setUndoAndCursorPosition: (mdText: string, position: number) => void;
  openSettings: boolean;
  setOpenSettings: Dispatch<SetStateAction<boolean>>;
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
  undoCursorPosition,
  redoCursorPosition,
  saveEditorText,
  setButtonValues,
  setCursor,
  setCursorPosition,
  setListButtonValues,
  setMdText,
  setRedoCursorPosition,
  setUndoCursorPosition,
  uploadImageRef,
  setUndoAndCursorPosition,
  openSettings,
  setOpenSettings,
}) => {
  const [showSpinner, setShowSpinner] = useState(false);

  return (
    <>
      {showSpinner && <ShowSpinner />}
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
              setUndoAndCursorPosition={setUndoAndCursorPosition}
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
              setUndoAndCursorPosition={setUndoAndCursorPosition}
            />
            <Image
              editorRef={editorRef}
              uploadImageRef={uploadImageRef}
              setUndoAndCursorPosition={setUndoAndCursorPosition}
              mdText={mdText}
              cursorPositionStart={cursorPositionStart}
            />
            <Video
              editorRef={editorRef}
              mdText={mdText}
              cursorPositionStart={cursorPositionStart}
              cursorPositionEnd={cursorPositionEnd}
              setMdText={setMdText}
              setCursorPosition={setCursorPosition}
              setCursor={setCursor}
              setUndoAndCursorPosition={setUndoAndCursorPosition}
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
              setUndoAndCursorPosition={setUndoAndCursorPosition}
            />
          </div>

          <div className="settingspanel">
            {/* <Languages saveEditorText={saveEditorText} setShowSpinner={setShowSpinner} /> */}
            <EditorDatamodal
              courseTitle={courseTitle}
              lessonTitle={lessonTitle}
              setShowSpinner={setShowSpinner}
              openSettings={openSettings}
              setOpenSettings={setOpenSettings}
            />
            <SubmitButton
              mdText={mdText}
              setShowSpinner={setShowSpinner}
              saveEditorText={saveEditorText}
            />
          </div>
          '
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
            setUndoAndCursorPosition={setUndoAndCursorPosition}
          />
          <Image
            editorRef={editorRef}
            uploadImageRef={uploadImageRef}
            setUndoAndCursorPosition={setUndoAndCursorPosition}
            mdText={mdText}
            cursorPositionStart={cursorPositionStart}
          />
          <Video
            editorRef={editorRef}
            mdText={mdText}
            cursorPositionStart={cursorPositionStart}
            cursorPositionEnd={cursorPositionEnd}
            setMdText={setMdText}
            setCursorPosition={setCursorPosition}
            setCursor={setCursor}
            setUndoAndCursorPosition={setUndoAndCursorPosition}
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
            setUndoAndCursorPosition={setUndoAndCursorPosition}
          />
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
              setUndoAndCursorPosition={setUndoAndCursorPosition}
            />

            <span style={{ marginRight: "5em" }} />

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
              setUndoAndCursorPosition={setUndoAndCursorPosition}
            />
          </div>
          <Autosave mdText={mdText} saveEditorText={saveEditorText} />
        </div>
      </div>

      <div>
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
            setUndoAndCursorPosition={setUndoAndCursorPosition}
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
            setUndoAndCursorPosition={setUndoAndCursorPosition}
          />
        )}
      </div>
    </>
  );
};

export default ButtonPanel;
