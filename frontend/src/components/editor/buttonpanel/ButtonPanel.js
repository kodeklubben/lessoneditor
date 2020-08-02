import "./buttonpanel.css";
import React from "react";
import Preview from "./Preview";
import Emphasis from "./Emphasis";
import UndoRedo from "./UndoRedo";
import Image from "./Image";
import Lists from "./Lists";
import Sections from "./Sections";
import CodeButton from "./CodeButton";
import MicrobitButtons from "./MicrobitButtons";
import SratchButtons from "./ScratchButtons";

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
}) => {
  const history = useHistory();

  const navigateToHome = (course, lesson) => {
    history.push("/");
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
        course={course}
      />
      {course === "Micro:bit" ? (
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
      ) : (
        ""
      )}
      {course === "Scratch" ? (
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
      ) : (
        ""
      )}

      <button
        className="ui right floated tiny button"
        id="buttonpanel"
        onClick={() => navigateToHome()}
      >
        <i className="arrow right icon" />
      </button>
    </>
  );
};

export default ButtonPanel;
