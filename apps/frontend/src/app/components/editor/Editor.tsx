import { useRef, useState } from "react";
import "./editor.scss";
import ButtonPanel from "./buttonpanel/ButtonPanel";
import ImageUpload from "./ImageUpload";
import MDPreview from "./MDPreview";
import MDTextArea from "./MDTextArea";
import ShowSpinner from "../ShowSpinner";
import { useFileContext } from "../../contexts/FileContext";
import { useParams } from "react-router";
import { useLessonContext } from "../../contexts/LessonContext";
import Navbar from "../navbar/Navbar";
import { filenameParser } from "../../utils/filename-parser";
import { stat } from "fs/promises";

const Editor: React.FC = () => {
  const { lessonId, file } = useParams<{ lessonId: string; file: string }>();

  const { state } = useLessonContext();
  const { saveFileBody, state: fileState } = useFileContext();
  const [mdText, setMdText] = useState("");
  const [showSpinner, setShowSpinner] = useState(true);
  const [buttonValues, setButtonValues] = useState({});
  const [cursorPositionStart, setCursorPositionStart] = useState(0);
  const [cursorPositionEnd, setCursorPositionEnd] = useState(0);
  const [undo, setUndo] = useState<string[]>([]);
  const [redo, setRedo] = useState<string[]>([]);
  const [undoCursorPosition, setUndoCursorPosition] = useState<number[]>([]);
  const [redoCursorPosition, setRedoCursorPosition] = useState<number[]>([]);
  const [renderContent, setRenderContent] = useState(false);
  const [listButtonValues, setListButtonValues] = useState({
    bTitle: "",
    output: "",
    cursorInt: 0,
  });

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const uploadImageRef = useRef<HTMLInputElement>(null);

  const { language } = filenameParser(file);

  const pushUndoValue = (mdText: string, cursorPositionStart: number) => {
    if (undo[undo.length - 1] !== mdText) {
      setUndo((undo) => [...undo, mdText]);
      setUndoCursorPosition((undoCursorPosition) => [...undoCursorPosition, cursorPositionStart]);
      setRedo(redo.slice(0, redo.length - 1));
      setMdText(redo[redo.length - 1]);
    }
  };

  const pushRedoValue = (mdText: string, cursorPositionStart: number) => {
    if (redo[redo.length] !== mdText) {
      setRedo((redo) => [...redo, mdText]);
      setRedoCursorPosition((redoCursorPosition) => [...redoCursorPosition, cursorPositionStart]);
      setUndo(undo.slice(0, undo.length - 1));
      setMdText(undo[undo.length - 1]);
    }
  };

  const setCursor = (pos1: number, pos2: number) => {
    setCursorPositionStart(pos1);
    setCursorPositionEnd(pos2);
  };

  /*
   * Av en eller annen grunn må denne funksjonen være async med awaitfor å fungere.
   */
  const setCursorPosition = async (positionStart: number, positionEnd: number) => {
    if (!editorRef.current) {
      return;
    }
    editorRef.current.selectionStart = await positionStart;
    editorRef.current.selectionEnd = await positionEnd;
  };

  const resetButtons = () => {
    setButtonValues({});
  };

  /**
   * Gjør litt state greier her:
   */

  if (showSpinner && fileState.savedFileBody) {
    setMdText(fileState.savedFileBody);
    setShowSpinner(false);
  }

  const saveEditorText = async () => {
    if (saveFileBody) {
      await saveFileBody(mdText);
    }
  };

  return (
    <>
      {showSpinner ? <ShowSpinner /> : ""}
      {state.lesson && 
      (
        <>
        <ImageUpload
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
        course={state.lesson?.courseSlug}
        courseTitle={state.lesson?.courseTitle}
        cursorPositionEnd={cursorPositionEnd}
        cursorPositionStart={cursorPositionStart}
        editorRef={editorRef}
        lessonTitle={state.lesson?.lessonTitle}
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
          course={state.lesson?.courseSlug}
        />
        <MDPreview
          mdText={mdText}
          course={state.lesson?.courseSlug}
          language={language}
          renderContent={renderContent}
        />
      </div>
      </>
      )
      }
  
    </>
  );
};
export default Editor;
