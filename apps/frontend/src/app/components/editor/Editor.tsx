import { useRef, useState, FC, useEffect } from "react";
import "./editor.scss";
import ButtonPanel from "./buttonpanel/ButtonPanel";
import ImageUpload from "./ImageUpload";
import MDPreview from "./MDPreview";
import MDTextArea from "./MDTextArea";
// import ShowSpinner from "../ShowSpinner";
import { useFileContext } from "../../contexts/FileContext";
import { useParams } from "react-router";
import { useLessonContext } from "../../contexts/LessonContext";
import Navbar from "../navbar/Navbar";
import { lessonGuideDefaultText, teacherGuideDefaultText } from "./settingsFiles/defaultTexts";

const Editor: FC = () => {
  const { file, lessonId, lang } = useParams() as any;
  const { state } = useLessonContext();

  const { saveFileBody, state: fileState, savedFileBody } = useFileContext();

  const [mdText, setMdText] = useState("");
  const [showSpinner, setShowSpinner] = useState(true);
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

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const uploadImageRef = useRef<HTMLInputElement>(null);

  const language: string = lang;

  const isDefaultText = [
    lessonGuideDefaultText[language],
    teacherGuideDefaultText[language],
  ].includes(fileState.savedFileBody || "");

  useEffect(() => {
    if (isDefaultText) {
      setOpenSettings(true);
    }
  }, [isDefaultText]);

  useEffect(() => {
    if (typeof savedFileBody !== "undefined") {
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
    }
  };

  const pushRedoValue = (mdText: string) => {
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
            <h1 style={{ display: "inline" }}>{state.lesson.lessonTitle}</h1>
            <h3 style={{ color: "silver", display: "inline" }}>{state.lesson.courseTitle}</h3>
          </Navbar>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundImage: "linear-gradient(#f7f7f7,#f7f7f7, white)",
            }}
          >
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
              setUndoAndCursorPosition={setUndoAndUndoPosition}
              openSettings={openSettings}
              setOpenSettings={setOpenSettings}
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
                <MDPreview mdText={mdText} course={state.lesson.courseSlug} language={language} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default Editor;
