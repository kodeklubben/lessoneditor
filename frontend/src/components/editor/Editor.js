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
import { UserContext } from "contexts/UserContext";
import ShowSpinner from "../ShowSpinner";
import parseMdHeader from "./utils/parseMdHeader";
import laererveiledningMal from "./LaererveiledningMal";
import oppgaveMal from "../editor/settingsFiles/oppgaveMal";
import { GRADE, SUBJECT, TOPIC } from "./datapanel/settings/landingpage_NO";

const Editor = () => {
  const { lessonId, file } = useParams();
  const lessonContext = useContext(LessonContext);
  const userContext = useContext(UserContext);
  const {
    getLessonData,
    data,
    setData,
    getYmlData,
    setHeaderData,
  } = lessonContext;
  const { user } = userContext;
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

  const language = file && file.slice(-3, -2) === "_" ? file.slice(-2) : "nb";

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

  const insertMetaDataInTeacherGuide = (ymlData) => {
    console.log("ymldata : " + JSON.stringify(ymlData));
    let subject = ymlData?.tags.subject.map((element) => {
      return SUBJECT[element];
    });
    let topic = ymlData?.tags.topic.map((element) => {
      return TOPIC[element];
    });
    let grade = ymlData?.tags.grade.map((element) => {
      return GRADE[element];
    });

    let veiledningWithData = laererveiledningMal.replace(
      /{subject}/,
      subject.join(", ")
    );
    veiledningWithData = veiledningWithData?.replace(
      /{topic}/,
      topic.join(", ")
    );
    veiledningWithData = veiledningWithData?.replace(
      /{grade}/,
      grade.join(", ")
    );
    console.log("veiledniingwithData : " + veiledningWithData);
    return veiledningWithData;
  };

  useEffect(() => {
    async function initLesson() {
      setShowSpinner(true);
      getLessonData().then(async (res) => {
        setData(res);
        async function fetchData() {
          const lessonText = await fetchMdText(lessonId, file);
          return lessonText;
        }
        fetchData().then(async (lessonText) => {
          const parts = lessonText.split("---\n");
          const parsedHeader = parts[1] ? parseMdHeader(parts[1]) : {};
          const body = parts[2] ? parts[2].trim() : "";

          if (body.length === 0) {
            if (file.slice(0, 6) === "README") {
              const ymlData = await getYmlData();
              const newTeacherGuide = insertMetaDataInTeacherGuide(ymlData);
              console.log("isREADME ");
              setMdText(newTeacherGuide);
              setOpenMetaData(true);
              setShowSpinner(false);
            } else {
              setMdText(oppgaveMal);
              setOpenMetaData(true);
              setShowSpinner(false);
            }
            setHeaderData({});
          } else {
            setMdText(body);
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
          }
        });
      });
    }

    if (lessonId && file) {
      initLesson();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, language, lessonId]);

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
        language={language ? language : ""}
        lessonTitle={data?.lessonTitle}
        courseTitle={data?.courseTitle}
        userName={user?.name}
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
          course={data?.course ? data?.course : ""}
        />
        <MDPreview
          mdText={mdText}
          renderContent={renderContent}
          course={data?.course ? data?.course : ""}
          language={language ? language : ""}
        />
      </div>
      <Autosave
        mdText={mdText}
        setRenderContent={setRenderContent}
        language={language ? language : ""}
      />
    </div>
  );
};
export default Editor;
