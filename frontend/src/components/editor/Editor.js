import React, { useContext, useRef, useState, useEffect } from "react";
import "./editor.scss";
// import Autosave from "./Autosave";
import ButtonPanel from "./buttonpanel/ButtonPanel";
import ImageUpload from "./ImageUpload";
import MDPreview from "./MDPreview";
import MDTextArea from "./MDTextArea";
import Navbar from "components/navbar/Navbar";
import ShowSpinner from "../ShowSpinner";
import { FileContext } from "../../contexts/FileContext";
import { LessonContext } from "contexts/LessonContext";
import { useParams } from "react-router";
import { UserContext } from "contexts/UserContext";

const Editor = () => {
  const { lessonId, file } = useParams();
  const { lessonData } = useContext(LessonContext);
  const { saveFileBody, savedFileBody, rawMdFileContent } = useContext(
    FileContext
  );
  const { user } = useContext(UserContext);
  const [mdText, setMdText] = useState("");
  const [showSpinner, setShowSpinner] = useState(true);
  const [buttonValues, setButtonValues] = useState({});
  const [cursorPositionStart, setCursorPositionStart] = useState(0);
  const [cursorPositionEnd, setCursorPositionEnd] = useState(0);
  const [undo, setUndo] = useState([""]);
  const [redo, setRedo] = useState([]);
  const [undoCursorPosition, setUndoCursorPosition] = useState([]);
  const [redoCursorPosition, setRedoCursorPosition] = useState([]);
  // const [renderContent, setRenderContent] = useState(false);
  const [openMetaData, setOpenMetaData] = useState(false);
  const [listButtonValues, setListButtonValues] = useState({
    bTitle: "",
    output: "",
    cursorInt: 0,
  });
  const editorRef = useRef();
  const uploadImageRef = useRef();

  //useeffect her for å forhindre infinite loop
  useEffect(() => {
    setOpenMetaData(rawMdFileContent.slice(0, 8) === "---\n---\n");
  }, [rawMdFileContent]);

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

  if (savedFileBody && lessonData && showSpinner) {
    setShowSpinner(false);
  }
  if (savedFileBody && mdText === "") {
    setMdText(savedFileBody);
  }

  const saveEditorText = async () => {
    await saveFileBody(lessonId, file, mdText);
  };

  const language = file && file.slice(-3, -2) === "_" ? file.slice(-2) : "nb";

  return (
    <div className="editor">
      {showSpinner ? <ShowSpinner /> : ""}
      <ImageUpload
        cursorPositionEnd={cursorPositionEnd}
        cursorPositionStart={cursorPositionStart}
        editorRef={editorRef}
        mdText={mdText}
        pushUndoValue={pushUndoValue}
        setCursorPosition={setCursorPosition}
        setCursorPositionEnd={setCursorPositionEnd}
        setCursorPositionStart={setCursorPositionStart}
        setMdText={setMdText}
        setShowSpinner={setShowSpinner}
        uploadImageRef={uploadImageRef}
      />
      <Navbar />
      <ButtonPanel
        buttonValues={buttonValues}
        course={lessonData.course}
        courseTitle={lessonData.courseTitle}
        cursorPositionEnd={cursorPositionEnd}
        cursorPositionStart={cursorPositionStart}
        editorRef={editorRef}
        language={language}
        lessonTitle={lessonData.lessonTitle}
        mdText={mdText}
        openMetaData={openMetaData}
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
        setOpenMetaData={setOpenMetaData}
        setRedoCursorPosition={setRedoCursorPosition}
        setShowSpinner={setShowSpinner}
        setUndoCursorPosition={setUndoCursorPosition}
        undo={undo}
        undoCursorPosition={undoCursorPosition}
        uploadImageRef={uploadImageRef}
        userName={user?.name}
      />
      <div className="textEditorContainer">
        <MDTextArea
          buttonValues={buttonValues}
          course={lessonData.course}
          cursorPositionStart={cursorPositionStart}
          editorRef={editorRef}
          listButtonValues={listButtonValues}
          mdText={mdText}
          pushUndoValue={pushUndoValue}
          resetButtons={resetButtons}
          setButtonValues={setButtonValues}
          setCursor={setCursor}
          setCursorPosition={setCursorPosition}
          setMdText={setMdText}
        />
        <MDPreview
          course={lessonData.course}
          language={language}
          mdText={mdText}
          // renderContent={renderContent}
        />
      </div>
      {/* <Autosave
        language={language}
        mdText={mdText}
        saveEditorText={saveEditorText}
        setRenderContent={setRenderContent}
      /> */}
    </div>
  );
};
export default Editor;
