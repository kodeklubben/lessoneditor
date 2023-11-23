import "./editor.scss";
import { useRef, useState, FC, useEffect } from "react";
import ButtonPanel from "../components/editor/buttonpanel/ButtonPanel";
import ImageUpload from "../components/editor/ImageUpload";
import MDPreviewArea from "../components/editor/MDPreviewArea";
import MDTextArea from "../components/editor/MDTextArea";
import { useFileContext } from "../contexts/FileContext";
import { useParams, useLocation } from "react-router";
import { useLessonContext } from "../contexts/LessonContext";
import Navbar from "../components/navbar/Navbar";

import ButtonPanel_SmallDevices from "../components/editor/buttonpanel/ButtonPanel_SmallDevices";

const Editor: FC = () => {
  const { lang } = useParams() as any;
  const { state } = useLessonContext();

  const { savedFileBody } = useFileContext();

  const [mdText, setMdText] = useState("");
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [buttonValues, setButtonValues] = useState({});
  const [cursorPositionStart, setCursorPositionStart] = useState(0);
  const [cursorPositionEnd, setCursorPositionEnd] = useState(0);
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
  const [preview, setPreview] = useState<boolean>(false);

  const [lineNumber, setLineNumber] = useState<number>(0);

  const location = useLocation();

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const uploadImageRef = useRef<HTMLInputElement>(null);

  const language: string = lang;

  useEffect(() => {
    if (location.search === "?init") {
      setOpenSettings(true);
    }
  }, [location.search]);

  useEffect(() => {
    if (typeof savedFileBody !== "undefined") {
      setCursor(savedFileBody.length, savedFileBody.length);
      setMdText(savedFileBody);
      setUndo([savedFileBody]);
      setUndoCursorPosition([savedFileBody.length]);
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
  };

  const setRedoAndRedoPosition = (mdText: string, position: number) => {
    setRedo([mdText]);
    setRedoCursorPosition([position]);
  };

  const pushUndoValue = (mdText: string, cursorPositionStart: number) => {
    resetButtons();
    if (undo.length > 0) {
      const text = undo[undo.length - 1];
      const position = undoCursorPosition[undoCursorPosition.length - 1];
      setRedo((prevRedo) => [...prevRedo, mdText]);
      setRedoCursorPosition((prevPosition) => [...prevPosition, cursorPositionStart]);
      removeLastUndoAndPosition();
      setMdText(text);
      setCursorPosition(position, position);
    } else {
      return;
    }
  };

  const pushRedoValue = (mdText: string) => {
    resetButtons();
    if (redo.length > 0) {
      console.log(redo.length);
      const text = redo[redo.length - 1];
      const position = redoCursorPosition[redoCursorPosition.length - 1];
      setUndoAndUndoPosition(mdText, position);
      removeLastRedoAndPosition();
      setMdText(text);
      setCursor(position, position);
    } else {
      return;
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

  return (
    <>
      {state.lesson && (
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
          <Navbar>
            <div>
              <h1 style={{ display: "inline" }}>{state.lesson.lessonTitle}</h1>
              <h3 style={{ color: "silver", display: "inline" }}>{state.lesson.courseTitle}</h3>
            </div>
          </Navbar>
          <div className="editor_container">
            <ButtonPanel
              buttonValues={buttonValues}
              course={state.lesson.courseSlug}
              courseTitle={state.lesson.courseTitle}
              cursorPositionStart={cursorPositionStart}
              cursorPositionEnd={cursorPositionEnd}
              editorRef={editorRef}
              lessonTitle={state.lesson.lessonTitle}
              mdText={mdText}
              pushRedoValue={pushRedoValue}
              pushUndoValue={pushUndoValue}
              redoCursorPosition={redoCursorPosition}
              setButtonValues={setButtonValues}
              setCursor={setCursor}
              setCursorPosition={setCursorPosition}
              setListButtonValues={setListButtonValues}
              setMdText={setMdText}
              setRedoCursorPosition={setRedoCursorPosition}
              setUndoCursorPosition={setUndoCursorPosition}
              undoCursorPosition={undoCursorPosition}
              uploadImageRef={uploadImageRef}
              setUndoAndUndoPosition={setUndoAndUndoPosition}
              openSettings={openSettings}
              setOpenSettings={setOpenSettings}
            />

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
                setUndoAndUndoPosition={setUndoAndUndoPosition}
                setRedoAndRedoPosition={setRedoAndRedoPosition}
                resetButtons={resetButtons}
                lineNumber={lineNumber}
                setLineNumber={setLineNumber}
              />

              <MDPreviewArea
                mdText={mdText}
                course={state.lesson.courseSlug}
                language={language}
                preview={preview}
                lineNumber={lineNumber}
              />
            </div>
            <ButtonPanel_SmallDevices
              buttonValues={buttonValues}
              course={state.lesson.courseSlug}
              courseTitle={state.lesson.courseTitle}
              cursorPositionStart={cursorPositionStart}
              cursorPositionEnd={cursorPositionEnd}
              editorRef={editorRef}
              mdText={mdText}
              setButtonValues={setButtonValues}
              setCursor={setCursor}
              setCursorPosition={setCursorPosition}
              setMdText={setMdText}
              setUndoAndUndoPosition={setUndoAndUndoPosition}
              setPreview={setPreview}
            />
          </div>
        </>
      )}
    </>
  );
};
export default Editor;
