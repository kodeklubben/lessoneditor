import "./editor.scss";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import Autosave from "./Autosave";
import Navbar from "components/navbar/Navbar";
import MDTextArea from "./MDTextArea";
import MDPreview from "./MDPreview";
import ButtonPanel from "./buttonpanel/ButtonPanel";
import ImageUpload from "./ImageUpload";
import fetchMdText from "../../api/fetch-md-text";
import { LessonContext } from "contexts/LessonContext";

import parseMdHeader from "./utils/parseMdHeader";

const Editor = () => {
  const { lessonId, file } = useParams();
  const context = useContext(LessonContext);
  const { language, data, setHeaderData } = context;
  const [mdText, setMdText] = useState("");
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

  const setCursorPosition = async (positionStart, positionEnd) => {
    editorRef.current.selectionStart = await positionStart;
    editorRef.current.selectionEnd = await positionEnd;
  };

  const resetButtons = () => {
    setButtonValues({});
  };

  useEffect(() => {
    if (lessonId && file) {
      async function fetchData() {
        try {
          const lessonText = await fetchMdText(lessonId, file);

          return lessonText;
        } catch (e) {
          console.log(e);
        }
      }
      fetchData().then(async (lessonText) => {
        const parsedHeader = parseMdHeader(lessonText);
        if (parsedHeader?.body) {
          setMdText(await parsedHeader.body);
          setUndo([await parsedHeader.body]);
        }
        if (parsedHeader?.header) {
          const test = {
            title: parsedHeader.header.title,
            authorList: parsedHeader.header.author
              ? parsedHeader.header.author.split(",").map((item) => {
                  return item.trim();
                })
              : [],
            translatorList: parsedHeader.header.translator
              ? parsedHeader.header.translator.split(",").map((item) => {
                  return item.trim();
                })
              : [],
          };
          console.log("test : " + JSON.stringify(test));
          setHeaderData(test);
        }
      });
    }
  }, [file, lessonId, setHeaderData]);

  return (
    <div className="editor">
      <ImageUpload
        editorRef={editorRef}
        uploadImageRef={uploadImageRef}
        mdText={mdText}
        pushUndoValue={pushUndoValue}
        cursorPositionStart={cursorPositionStart}
        cursorPositionEnd={cursorPositionEnd}
        setMdText={setMdText}
        setCursorPositionStart={setCursorPositionStart}
        setCursorPositionEnd={setCursorPositionEnd}
        setCursorPosition={setCursorPosition}
      />
      <Navbar />
      <ButtonPanel
        editorRef={editorRef}
        uploadImageRef={uploadImageRef}
        mdText={mdText}
        buttonValues={buttonValues}
        cursorPositionStart={cursorPositionStart}
        cursorPositionEnd={cursorPositionEnd}
        undo={undo}
        redo={redo}
        undoCursorPosition={undoCursorPosition}
        redoCursorPosition={redoCursorPosition}
        pushUndoValue={pushUndoValue}
        pushRedoValue={pushRedoValue}
        setMdText={setMdText}
        setCursorPosition={setCursorPosition}
        setCursor={setCursor}
        setButtonValues={setButtonValues}
        setUndoCursorPosition={setUndoCursorPosition}
        setRedoCursorPosition={setRedoCursorPosition}
        setListButtonValues={setListButtonValues}
        file={file}
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
        />
        <MDPreview
          mdText={mdText}
          renderContent={renderContent}
          course={data.course ? data.course : ""}
          language={language ? language : ""}
        />
      </div>
      <Autosave mdText={mdText} setRenderContent={setRenderContent} />
    </div>
  );
};
export default Editor;
