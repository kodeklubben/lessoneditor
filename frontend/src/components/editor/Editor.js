import React, { useContext, useRef, useState } from "react";
import "./editor.scss";
import ButtonPanel from "./buttonpanel/ButtonPanel";
import ImageUpload from "./ImageUpload";
import MDPreview from "./MDPreview";
import MDTextArea from "./MDTextArea";
import Navbar from "components/navbar/Navbar";
import ShowSpinner from "../ShowSpinner";
import { FileContext } from "../../contexts/FileContext";
import { LessonContext } from "contexts/LessonContext";
import { useParams } from "react-router";

const Editor = () => {
  const { lessonId, file } = useParams();
  const { lessonData } = useContext(LessonContext);
  const { saveFileBody, savedFileBody } = useContext(FileContext);
  const [mdText, setMdText] = useState("");
  const [showSpinner, setShowSpinner] = useState(true);
  const [buttonValues, setButtonValues] = useState({});
  const [cursorPositionStart, setCursorPositionStart] = useState(0);
  const [cursorPositionEnd, setCursorPositionEnd] = useState(0);
  const [undo, setUndo] = useState([""]);
  const [redo, setRedo] = useState([]);
  const [undoCursorPosition, setUndoCursorPosition] = useState([]);
  const [redoCursorPosition, setRedoCursorPosition] = useState([]);
  const [renderContent, setRenderContent] = useState(false);
  const [listButtonValues, setListButtonValues] = useState({
    bTitle: "",
    output: "",
    cursorInt: 0,
  });

  const editorRef = useRef();
  const uploadImageRef = useRef();

  const language = file && file.slice(-3, -2) === "_" ? file.slice(-2) : "nb";

  const pushUndoValue = (mdText, cursorPositionStart) => {
    if (
      undo[undo.length - 1] !== mdText &&
      undoCursorPosition !== cursorPositionStart
    ) {
      setUndo((undo) => [...undo, mdText]);
      setUndoCursorPosition((undoCursorPosition) => [
        ...undoCursorPosition,
        cursorPositionStart,
      ]);
      setRedo(redo.slice(0, redo.length - 1));
      setMdText(redo[redo.length - 1]);
    }
  };

  const pushRedoValue = (mdText, cursorPositionStart) => {
    if (
      redo[redo.length] !== mdText &&
      redoCursorPosition !== cursorPositionStart
    ) {
      setRedo((redo) => [...redo, mdText]);
      setRedoCursorPosition((redoCursorPosition) => [
        ...redoCursorPosition,
        cursorPositionStart,
      ]);
      setUndo(undo.slice(0, undo.length - 1));
      setMdText(undo[undo.length - 1]);
    }
  };

  const setCursor = (pos1, pos2) => {
    setCursorPositionStart(pos1);
    setCursorPositionEnd(pos2);
  };

  /*
   * Av en eller annen grunn må denne funksjonen være async for å fungere.
   */
  const setCursorPosition = async (positionStart, positionEnd) => {
    editorRef.current.selectionStart = await positionStart;
    editorRef.current.selectionEnd = await positionEnd;
  };

  const resetButtons = () => {
    setButtonValues({});
  };

  /**
   * Gjør litt state greier her:
   */

  if (showSpinner && savedFileBody && mdText === "") {
    setMdText(savedFileBody);
    setShowSpinner(false);
  }

  const saveEditorText = async () => {
    await saveFileBody(lessonId, file, mdText);
  };

  return (
    <>
      {showSpinner ? <ShowSpinner /> : ""}
      <ImageUpload
        editorRef={editorRef}
        uploadImageRef={uploadImageRef}
        mdText={mdText}
        pushUndoValue={pushUndoValue}
        cursorPositionStart={cursorPositionStart}
        cursorPositionEnd={cursorPositionEnd}
        setMdText={setMdText}
        setCursor={setCursor}
        setCursorPosition={setCursorPosition}
      />
      <Navbar />
      <ButtonPanel
        buttonValues={buttonValues}
        course={lessonData.course}
        courseTitle={lessonData.courseTitle}
        cursorPositionEnd={cursorPositionEnd}
        cursorPositionStart={cursorPositionStart}
        editorRef={editorRef}
        lessonTitle={lessonData.lessonTitle}
        mdText={mdText}
        pushRedoValue={pushRedoValue}
        pushUndoValue={pushUndoValue}
        redo={redo}
        redoCursorPosition={redoCursorPosition}
        saveEditorText={saveEditorText}
        setButtonValues={setButtonValues}
        setCursor={setCursor}
        setCursorPosition={setCursorPosition}
        setListButtonValues={setListButtonValues}
        setMdText={setMdText}
        setRedoCursorPosition={setRedoCursorPosition}
        setUndoCursorPosition={setUndoCursorPosition}
        setRenderContent={setRenderContent}
        undo={undo}
        undoCursorPosition={undoCursorPosition}
        uploadImageRef={uploadImageRef}
      />
      <div className="textEditorContainer">
        <MDTextArea
          editorRef={editorRef}
          mdText={mdText}
          buttonValues={buttonValues}
          listButtonValues={listButtonValues}
          cursorPositionStart={cursorPositionStart}
          setCursorPosition={setCursorPosition}
          setMdText={setMdText}
          setButtonValues={setButtonValues}
          setCursor={setCursor}
          pushUndoValue={pushUndoValue}
          resetButtons={resetButtons}
          course={lessonData.course}
        />
        <MDPreview
          mdText={mdText}
          course={lessonData.course}
          language={language}
          renderContent={renderContent}
        />
      </div>
    </>
  );
};
export default Editor;
