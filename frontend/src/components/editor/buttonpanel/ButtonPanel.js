import "./buttonpanel.css";
import React from "react";
import Emphasis from "./Emphasis";
import UndoRedo from "./UndoRedo";
import Image from "./Image";
import Lists from "./Lists";
import Sections from "./Sections";
import CodeButton from "./CodeButton";
import MicrobitButtons from "./MicrobitButtons";
import SratchButtons from "./ScratchButtons";
import EditorDatapanel from "../datapanel/EditorDatapanel";
import saveMdText from "../../../api/save-md-text";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router";

const ButtonPanel = ({
  editorRef,
  uploadImageRef,
  mdText,
  buttonValues,
  cursorPositionStart,
  cursorPositionEnd,
  undo,
  redo,
  undoCursorPosition,
  redoCursorPosition,
  pushUndoValue,
  pushRedoValue,
  setMdText,
  setCursorPosition,
  setCursor,
  setButtonValues,
  setUndoCursorPosition,
  setRedoCursorPosition,
  setListButtonValues,
  course,
}) => {
  const history = useHistory();
  const { lessonId, file } = useParams();
  const navigateToHome = async () => {
    await saveMdText(lessonId, file, mdText, true);
    history.push("/");
  };

  return (
    <div className="buttonpanel">
      <div style={{ display: "inline" }}>
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
        <UndoRedo
          editorRef={editorRef}
          mdText={mdText}
          undo={undo}
          redo={redo}
          cursorPositionStart={cursorPositionStart}
          undoCursorPosition={undoCursorPosition}
          redoCursorPosition={redoCursorPosition}
          pushUndoValue={pushUndoValue}
          pushRedoValue={pushRedoValue}
          setRedoCursorPosition={setRedoCursorPosition}
          setCursorPosition={setCursorPosition}
          setUndoCursorPosition={setUndoCursorPosition}
        />
        <Image editorRef={editorRef} uploadImageRef={uploadImageRef} />
        <Lists
          editorRef={editorRef}
          mdText={mdText}
          buttonValues={buttonValues}
          cursorPositionStart={cursorPositionStart}
          cursorPositionEnd={cursorPositionEnd}
          setMdText={setMdText}
          setCursorPosition={setCursorPosition}
          setCursor={setCursor}
          setListButtonValues={setListButtonValues}
          setButtonValues={setButtonValues}
        />
        <CodeButton
          editorRef={editorRef}
          mdText={mdText}
          buttonValues={buttonValues}
          cursorPositionStart={cursorPositionStart}
          cursorPositionEnd={cursorPositionEnd}
          setMdText={setMdText}
          setCursorPosition={setCursorPosition}
          setCursor={setCursor}
          setButtonValues={setButtonValues}
          course={course}
        />
        <div style={{ display: "inline", marginLeft: "auto" }}>
          <button
            className="ui button"
            id="next"
            onClick={() => navigateToHome()}
          >
            <i className="arrow right icon" />
          </button>
          <EditorDatapanel />
        </div>
      </div>

      <br />
      <div>
        <Sections
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
      </div>

      {course === "microbit" ? (
        <>
          <MicrobitButtons
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
        </>
      ) : (
        ""
      )}
      {course === "scratch" ? (
        <>
          <SratchButtons
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
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default ButtonPanel;
