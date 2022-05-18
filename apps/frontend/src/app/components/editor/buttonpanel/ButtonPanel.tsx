import "./buttonpanel.scss";
import { Dispatch, SetStateAction, FC, RefObject, useState } from "react";
// import ShowSpinner from "../../ShowSpinner";
import Autosave from "../Autosave";
import Emphasis from "./Emphasis";
import UndoRedo from "./UndoRedo";
import Hyperlink from "./Hyperlink";
import Image from "./Image";
import Video from "./Video";
import Languages from "./Languages";
import Lists from "./Lists";
import Explorer from "./Explorer";
import Sections from "./Sections";
import CodeButtons from "./CodeButtons";
import Preview from "./Preview";
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
  setUndoAndUndoPosition: (mdText: string, position: number) => void;
  openSettings: boolean;
  setOpenSettings: Dispatch<SetStateAction<boolean>>;
  setPreview: Dispatch<SetStateAction<boolean>>;
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
  setButtonValues,
  setCursor,
  setCursorPosition,
  setListButtonValues,
  setMdText,
  setRedoCursorPosition,
  setUndoCursorPosition,
  uploadImageRef,
  setUndoAndUndoPosition,
  openSettings,
  setOpenSettings,
  setPreview,
}) => {
  return (
    <>
      <div className="buttonpanel">
        <div className="top_panel">
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
                setUndoAndUndoPosition={setUndoAndUndoPosition}
              />

              <div style={{ marginRight: "3rem" }} />

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
              <div style={{ marginRight: "3rem" }} />
              <Hyperlink
                editorRef={editorRef}
                mdText={mdText}
                cursorPositionStart={cursorPositionStart}
                cursorPositionEnd={cursorPositionEnd}
                setMdText={setMdText}
                setCursorPosition={setCursorPosition}
                setCursor={setCursor}
                setUndoAndUndoPosition={setUndoAndUndoPosition}
              />
              <Image
                editorRef={editorRef}
                uploadImageRef={uploadImageRef}
                setUndoAndUndoPosition={setUndoAndUndoPosition}
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
                setUndoAndUndoPosition={setUndoAndUndoPosition}
              />
              <div style={{ marginRight: "3rem" }} />
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
                setUndoAndUndoPosition={setUndoAndUndoPosition}
              />
              {/* <div style={{ marginRight: "3em" }} />
            <Explorer /> */}
            </div>
            <div className="settingspanel">
              {/* <Languages saveEditorText={saveEditorText} setShowSpinner={setShowSpinner} /> */}
              <EditorDatamodal
                courseTitle={courseTitle}
                lessonTitle={lessonTitle}
                openSettings={openSettings}
                setOpenSettings={setOpenSettings}
              />
              <SubmitButton mdText={mdText} />
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
                setUndoAndUndoPosition={setUndoAndUndoPosition}
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
                setUndoAndUndoPosition={setUndoAndUndoPosition}
              />
            </div>
            <Autosave mdText={mdText} />
          </div>
          <div className="scratchmicrobit_row">
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
          <div className="firstrow_mobile">
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

            <div className="settingspanel">
              {/* <Languages saveEditorText={saveEditorText} setShowSpinner={setShowSpinner} /> */}
              <EditorDatamodal
                courseTitle={courseTitle}
                lessonTitle={lessonTitle}
                openSettings={openSettings}
                setOpenSettings={setOpenSettings}
              />
              <SubmitButton mdText={mdText} />
            </div>

            <Autosave mdText={mdText} />
          </div>
        </div>
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

export default ButtonPanel;
