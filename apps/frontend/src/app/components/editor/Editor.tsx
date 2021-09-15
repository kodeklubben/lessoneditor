import { FC, useRef, useState, useEffect } from "react";
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

const Editor: FC = () => {
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
  const [undoCursorPosition, setUndoCursorPosition] = useState<number[]>([0]);
  const [redoCursorPosition, setRedoCursorPosition] = useState<number[]>([0]);
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

  useEffect(() => {
    if (savedFileBody) {
      setCursor(savedFileBody.length, savedFileBody.length);
      setMdText(savedFileBody);
      setUndo([savedFileBody]);
      setUndoCursorPosition([savedFileBody.length]);
      setShowSpinner(false);
    }
  }, [savedFileBody]);

  const removeLastUndoAndPosition = () => {
    setUndo((prevUndo) => prevUndo.slice(0, prevUndo.length - 1));
    setUndoCursorPosition((prevPosition) => prevPosition.slice(0, prevPosition.length - 1));
  };
  const removeLastRedoAndPosition = () => {
    setRedo((prevRedo) => prevRedo.slice(0, prevRedo.length - 1));
    setRedoCursorPosition((prevPosition) => prevPosition.slice(0, prevPosition.length - 1));
  };

  const setUndoAndUndoPosition = (mdText: string, position: number) => {
    setUndo((prevUndo) => [...prevUndo, mdText]);
    setUndoCursorPosition((prevPosition) => [...prevPosition, position]);
    console.log(undoCursorPosition);
  };

  const pushUndoValue = (mdText: string, cursorPositionStart: number) => {
    if (undo.length > 0) {
      const text = undo[undo.length - 1];
      const position = undoCursorPosition[undoCursorPosition.length - 1];
      setRedo((prevRedo) => [...prevRedo, mdText]);
      setRedoCursorPosition((prevPosition) => [...prevPosition, cursorPositionStart]);
      removeLastUndoAndPosition();
      setMdText(text);
      setCursorPosition(position, position);
    }
  };

  const pushRedoValue = (mdText: string, position: number) => {
    resetButtons();
    if (redo.length > 0) {
      const text = redo[redo.length - 1];
      const position = redoCursorPosition[redoCursorPosition.length - 1];
      setUndoAndUndoPosition(mdText, position);
      removeLastRedoAndPosition();
      setMdText(text);
      setCursor(position, position);
    }
  };

  const setCursor = (pos1: number, pos2: number) => {
    setCursorPositionStart(pos1);
    setCursorPositionEnd(pos2);
  };

  /*
   * Av en eller annen grunn må denne funksjonen være async med await for å fungere.
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
        setUndoAndCursorPosition={setUndoAndUndoPosition}
      />
      <div className="text-editor-container">
        <div className="editor-windows">
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
            setUndoAndCursorPosition={setUndoAndUndoPosition}
            resetButtons={resetButtons}
          />
          <MDPreview
            mdText={mdText}
            course={lessonData.course}
            language={language}
            cursorPositionStart={cursorPositionStart}
          />
        </div>
      </div>
    </>
  );
};
export default Editor;
