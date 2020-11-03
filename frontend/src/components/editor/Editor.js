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
import ShowSpinner from "../ShowSpinner";
import parseMdHeader from "./utils/parseMdHeader";
import laererveiledningMal from "./LaererveiledningMal";
import oppgaveMal from "../editor/settingsFiles/oppgaveMal";
import {
  GRADE,
  SUBJECT,
  TOPIC,
} from "../editor/buttonpanel/datapanel/settings/landingpage_NO";

const Editor = () => {
  const { lessonId, file, language } = useParams();
  const context = useContext(LessonContext);
  const { data, getYmlData, setData, setHeaderData, getLessonData } = context;
  const [mdText, setMdText] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
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

  const [openMetaData, setOpenMetaData] = useState(false);

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
    getLessonData().then((res) => {
      setData(res.data);
      setShowSpinner(true);
      if (lessonId && file) {
        async function fetchData() {
          const lessonText = await fetchMdText(
            lessonId,
            language === "nb" ? file : `${file}_${language}`
          );
          return lessonText;
        }

        fetchData().then(async (lessonText) => {
          const parts = lessonText.split("---\n");
          const parsedHeader = parts[1] ? parseMdHeader(parts[1]) : {};
          const body = parts[2] ? parts[2].trim() : "";
          if (body.length === 0) {
            const ymlData = await getYmlData();

            let subject = ymlData.tags.subject;
            let topic = ymlData.tags.topic;
            let grade = ymlData.tags.grade;

            const a = laererveiledningMal.replace(
              /{subject}/,
              subject.join(", ")
            );
            const b = a.replace(/{topic}/, topic.join(", "));
            const c = b.replace(/{grade}/, grade.join(", "));
            setOpenMetaData(true);
            file === "README" ? setMdText(c) : setMdText(oppgaveMal);
            setHeaderData({});
            setShowSpinner(false);
            return;
          } else setMdText(body);
          setUndo([body]);
          const newHeaderData = {
            title: parsedHeader.title,
            authorList: parsedHeader.author
              ? parsedHeader.author.split(",").map((item) => {
                  return item.trim();
                })
              : [],
            translatorList: parsedHeader.translator
              ? parsedHeader.translator.split(",").map((item) => {
                  return item.trim();
                })
              : [],
          };
          setHeaderData(newHeaderData);
          setShowSpinner(false);
          return;
        });
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, language, lessonId, setHeaderData]);

  return (
    <div className="editor">
      {showSpinner ? <ShowSpinner /> : ""}
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
        setShowSpinner={setShowSpinner}
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
        openMetaData={openMetaData}
        setOpenMetaData={setOpenMetaData}
        setShowSpinner={setShowSpinner}
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
          course={data.course ? data.course : ""}
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
