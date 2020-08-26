import "./buttonpanel.scss";
import React, { useContext } from "react";
import Emphasis from "./Emphasis";
import UndoRedo from "./UndoRedo";
import Image from "./Image";
import Languages from "./Languages";
import Lists from "./Lists";
import Sections from "./Sections";
import CodeButton from "./CodeButton";
import MicrobitButtons from "./MicrobitButtons";
import SratchButtons from "./ScratchButtons";
import EditorDatapanel from "./datapanel/EditorDatapanel";
import saveMdText from "../../../api/save-md-text";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router";
import { LessonContext } from "contexts/LessonContext";

const ButtonPanel = ({
  editorRef,
  uploadImageRef,
  mdText,
  buttonValues,
  cursorPositionStart,
  cursorPositionEnd,
  undo,
  redo,
  undoCursorPosition,
  redoCursorPosition,
  pushUndoValue,
  pushRedoValue,
  setMdText,
  setCursorPosition,
  setCursor,
  setButtonValues,
  setUndoCursorPosition,
  setRedoCursorPosition,
  setListButtonValues,
  file,
}) => {
  const history = useHistory();
  const { lessonId } = useParams();
  const context = useContext(LessonContext);
  const { data, language } = context;
  const course = data.course;

  let header;

  if (
    data.header[language] &&
    Object.keys(data.header[language]).length !== 0
  ) {
    header = `---
title: ${data.header[language].title ? data.header[language].title : `test`}
author: ${
      data.header[language].authorList ? data.header[language].authorList : ""
    } ${
      data.header[language].translatorList &&
      data.header[language].translatorList.length > 0
        ? `
translator: ${data.header[language].translatorList}`
        : ""
    }
language: ${language ? language : ""}
---
`;
  }

  let newMdText = header !== undefined ? header + "\n\n\n" + mdText : mdText;

  const navigateToHome = async () => {
    if (newMdText.length > 0 && language === "nb")
      await saveMdText(lessonId, file, mdText, true);
    if (newMdText.length > 0) await saveMdText(lessonId, file, newMdText);
    const target = ["/landingpage", lessonId].join("/");
    history.push(target);
  };

  return (
    <div className="buttonpanel" style={{ paddingBottom: "0.25em" }}>
      <div style={{ display: "inline" }}>
        <Emphasis
          editorRef={editorRef}
          mdText={mdText}
          buttonValues={buttonValues}
          cursorPositionStart={cursorPositionStart}
          cursorPositionEnd={cursorPositionEnd}
          setMdText={setMdText}
          setCursorPosition={setCursorPosition}
          setCursor={setCursor}
          setButtonValues={setButtonValues}
        />
        <UndoRedo
          editorRef={editorRef}
          mdText={mdText}
          undo={undo}
          redo={redo}
          cursorPositionStart={cursorPositionStart}
          undoCursorPosition={undoCursorPosition}
          redoCursorPosition={redoCursorPosition}
          pushUndoValue={pushUndoValue}
          pushRedoValue={pushRedoValue}
          setRedoCursorPosition={setRedoCursorPosition}
          setCursorPosition={setCursorPosition}
          setUndoCursorPosition={setUndoCursorPosition}
        />
        <Image editorRef={editorRef} uploadImageRef={uploadImageRef} />
        <Lists
          editorRef={editorRef}
          mdText={mdText}
          buttonValues={buttonValues}
          cursorPositionStart={cursorPositionStart}
          cursorPositionEnd={cursorPositionEnd}
          setMdText={setMdText}
          setCursorPosition={setCursorPosition}
          setCursor={setCursor}
          setListButtonValues={setListButtonValues}
          setButtonValues={setButtonValues}
        />

        <div style={{ display: "flex", float: "right" }}>
          <Languages mdText={mdText} file={file} />
          <EditorDatapanel headerData={data.header} />
          <button
            className={`ui ${mdText.length < 1 ? `disabled` : ``} button`}
            id="next"
            onClick={() => navigateToHome()}
          >
            <i className="arrow right icon" />
          </button>
        </div>
      </div>

      <br />
      <div>
        <Sections
          editorRef={editorRef}
          mdText={mdText}
          buttonValues={buttonValues}
          cursorPositionStart={cursorPositionStart}
          cursorPositionEnd={cursorPositionEnd}
          setMdText={setMdText}
          setCursorPosition={setCursorPosition}
          setCursor={setCursor}
          setButtonValues={setButtonValues}
        />
        <span style={{ marginLeft: "5em", position: "relative", top: "-4px" }}>
          <CodeButton
            editorRef={editorRef}
            mdText={mdText}
            buttonValues={buttonValues}
            cursorPositionStart={cursorPositionStart}
            cursorPositionEnd={cursorPositionEnd}
            setMdText={setMdText}
            setCursorPosition={setCursorPosition}
            setCursor={setCursor}
            setButtonValues={setButtonValues}
          />
        </span>
      </div>
      <div>
        {course === "microbit" ? (
          <>
            <MicrobitButtons
              editorRef={editorRef}
              mdText={mdText}
              buttonValues={buttonValues}
              cursorPositionStart={cursorPositionStart}
              cursorPositionEnd={cursorPositionEnd}
              setMdText={setMdText}
              setCursorPosition={setCursorPosition}
              setCursor={setCursor}
              setButtonValues={setButtonValues}
            />
          </>
        ) : (
          ""
        )}
        {course === "scratch" ? (
          <>
            <SratchButtons
              editorRef={editorRef}
              mdText={mdText}
              buttonValues={buttonValues}
              cursorPositionStart={cursorPositionStart}
              cursorPositionEnd={cursorPositionEnd}
              setMdText={setMdText}
              setCursorPosition={setCursorPosition}
              setCursor={setCursor}
              setButtonValues={setButtonValues}
            />
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ButtonPanel;
