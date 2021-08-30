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

const Editor: React.FC = () => {
  const { lessonId, file } = useParams<{ lessonId: string; file: string }>();

  const { lessonData } = useLessonContext();
  const { saveFileBody, savedFileBody } = useFileContext();
  const [mdText, setMdText] = useState<string>("");
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [buttonValues, setButtonValues] = useState<Record<string, boolean>>({});
  const [cursorPositionStart, setCursorPositionStart] = useState<number>(0);
  const [cursorPositionEnd, setCursorPositionEnd] = useState<number>(0);
  const [undo, setUndo] = useState<string[]>([]);
  const [redo, setRedo] = useState<string[]>([]);
  const [undoCursorPosition, setUndoCursorPosition] = useState<number[]>([]);
  const [redoCursorPosition, setRedoCursorPosition] = useState<number[]>([]);
  const [listButtonValues, setListButtonValues] = useState<{
    bTitle: string;
    output: string;
    cursorInt: number;
  }>({
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
    editorRef.current.setSelectionRange(await positionStart, await positionEnd);
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

  const saveEditorText = async (regenThumb: boolean) => {
    if (saveFileBody) {
      await saveFileBody(lessonId, file, mdText, regenThumb);
    }
  };

  return (
    <>
      {showSpinner ? <ShowSpinner /> : ""}
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
        course={lessonData.course}
        courseTitle={lessonData.courseTitle}
        cursorPositionStart={cursorPositionStart}
        cursorPositionEnd={cursorPositionEnd}
        editorRef={editorRef}
        lessonTitle={lessonData.lessonTitle}
        mdText={mdText}
        pushRedoValue={pushRedoValue}
        pushUndoValue={pushUndoValue}
        redoCursorPosition={redoCursorPosition}
        saveEditorText={saveEditorText}
        setButtonValues={setButtonValues}
        setCursor={setCursor}
        setCursorPosition={setCursorPosition}
        setListButtonValues={setListButtonValues}
        setMdText={setMdText}
        setRedoCursorPosition={setRedoCursorPosition}
        setUndoCursorPosition={setUndoCursorPosition}
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
        <MDPreview mdText={mdText} course={lessonData.course} language={language} />
      </div>
    </>
  );
};
export default Editor;
