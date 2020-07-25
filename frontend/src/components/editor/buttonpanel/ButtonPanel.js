import "./buttonpanel.css";
import React from "react";
import Preview from "./Preview";
import Emphasis from "./Emphasis";
import UndoRedo from "./UndoRedo";
import Image from "./Image";
import Lists from "./Lists";
import Sections from "./Sections";
import Code from "./Code";

import { useHistory } from "react-router-dom";

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
  handlePreview,
  pushUndoValue,
  pushRedoValue,
  setMdText,
  setCursorPosition,
  setCursor,
  setButtonValues,
  setUndoCursorPosition,
  setRedoCursorPosition,
  setListButtonValues,
  course,
  lesson,
}) => {
  const history = useHistory();

  const navigateToMidPage = (course, lesson) => {
    const target = ["/mid-page", course, lesson, lesson].join("/");
    history.push(target);
  };

  return (
    <>
      <Preview handlePreview={handlePreview} />
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
      <Code
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
      <button
        className="ui right floated button"
        id="buttonpanel"
        onClick={() => navigateToMidPage(course, lesson)}
      >
        <i className="arrow right icon" />
      </button>
    </>
  );
};

export default ButtonPanel;
