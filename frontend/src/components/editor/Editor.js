import "./editor.css";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import Header from "components/Header/Header";
import MDTextArea from "./MDTextArea";
import MDPreview from "./MDPreview";
import ButtonPanel from "./buttonpanel/ButtonPanel";
import ImageUpload from "./ImageUpload";
import editorButtonsValue from "./buttonpanel/utils/editorButtonsValue";
import fetchMdText from "../../api/fetch-md-text";
import saveMdText from "../../api/save-md-text";
import { UserContext } from "../../contexts/UserContext";

let orderedListIndex = 2;

let tabSize = 2;

const Editor = () => {
  const context = useContext(UserContext);
  const [mdText, setMdText] = useState("");
  const [savedText, setSavedText] = useState("");
  const [buttonValues, setButtonValues] = useState(editorButtonsValue);
  const [cursorPositionStart, setCursorPositionStart] = useState(0);
  const [cursorPositionEnd, setCursorPositionEnd] = useState(0);
  const [undo, setUndo] = useState([""]);
  const [redo, setRedo] = useState([]);
  const [undoCursorPosition, setUndoCursorPosition] = useState([]);
  const [redoCursorPosition, setRedoCursorPosition] = useState([]);
  const [listButtonValues, setListButtonValues] = useState({
    bTitle: "",
    output: "",
    cursorInt: 0,
  });

  const { course, lesson, file } = useParams();

  let editorRef = useRef();
  let uploadImageRef = useRef();

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
    setButtonValues(editorButtonsValue);
  };

  useEffect(() => {
    if (course && lesson && file) {
      async function fetchData() {
        let lessonText = await fetchMdText(course, lesson, file);
        setSavedText(lessonText);
        setMdText(lessonText);
      }
      fetchData();
    }
  }, [course, lesson, file]);

  useInterval(async () => {
    if (mdText !== savedText) {
      await saveMdText(course, lesson, file, mdText);
      if (!context.getLesson(course, lesson)) {
        await context.addLesson(course, lesson, lesson);
      }
      setSavedText(mdText);
    }
  }, 5000);

  function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  const handleChange = async (event) => {
    setCursor(event.target.selectionStart, event.target.selectionEnd);

    let inputText = event.target.value;

    if (
      inputText[cursorPositionStart] === " " ||
      inputText[cursorPositionStart] === "\n"
    ) {
      pushUndoValue(inputText, cursorPositionStart);
    }
    setMdText(inputText);
  };

  const onTextareaKeyUp = (event) => {
    setCursor(event.target.selectionStart, event.target.selectionEnd);
  };

  const onTextareaSelect = (event) => {
    setCursor(event.target.selectionStart, event.target.selectionEnd);
  };

  const onTextareaMouseDown = (event) => {
    setCursor(event.target.selectionStart, event.target.selectionEnd);

    resetButtons();
  };

  const onTextareaKeyDown = (event) => {
    setCursor(event.target.selectionStart, event.target.selectionEnd);

    if (event.key === "Enter") {
      if (buttonValues[listButtonValues["bTitle"]]) {
        event.preventDefault();

        if (
          mdText.slice(
            cursorPositionStart - listButtonValues["cursorInt"],
            cursorPositionStart
          ) === listButtonValues["output"] ||
          mdText.slice(
            cursorPositionStart - listButtonValues["cursorInt"],
            cursorPositionStart
          ) ===
            orderedListIndex - 1 + ". "
        ) {
          setButtonValues((prevState) => ({
            ...prevState,
            [listButtonValues["bTitle"]]: !buttonValues[
              listButtonValues["bTitle"]
            ],
          }));
          setMdText(
            mdText.slice(
              0,
              cursorPositionStart - listButtonValues["cursorInt"]
            ) + mdText.slice(cursorPositionStart)
          );
          setCursorPosition(
            cursorPositionStart - listButtonValues["cursorInt"],
            cursorPositionStart - listButtonValues["cursorInt"]
          );
          orderedListIndex = 2;
          return;
        }
        if (listButtonValues["bTitle"] === "listOl") {
          setMdText(
            mdText.slice(0, cursorPositionStart) +
              "\n\n" +
              (orderedListIndex + ". ") +
              mdText.slice(cursorPositionStart)
          );
          setCursorPosition(
            cursorPositionStart + listButtonValues["cursorInt"] + 2,
            cursorPositionStart + listButtonValues["cursorInt"] + 2
          );
          orderedListIndex++;
          return;
        }

        setMdText(
          mdText.slice(0, cursorPositionStart) +
            "\n\n" +
            listButtonValues["output"] +
            mdText.slice(cursorPositionStart)
        );
        setCursorPosition(
          cursorPositionStart + listButtonValues["cursorInt"] + 2,
          cursorPositionStart + listButtonValues["cursorInt"] + 2
        );
        return;
      }
    }

    if (event.key === "Tab") {
      event.preventDefault();
      pushUndoValue(mdText, cursorPositionStart);
      let outputText =
        mdText.slice(0, cursorPositionStart) +
        " ".repeat(tabSize) +
        mdText.slice(cursorPositionStart);
      setMdText(outputText);
      let position = cursorPositionStart + tabSize;
      setCursorPosition(position, position);
      return;
    }

    if (
      event.key === "ArrowLeft" ||
      event.key === "ArrowUp" ||
      event.key === "ArrowRight" ||
      event.key === "ArrowDown"
    ) {
      resetButtons();
    }
  };

  const imageSubmitHandler = (imageInputValue, filename) => {
    if (imageInputValue) {
      pushUndoValue(mdText, cursorPositionStart);
      setMdText(
        mdText.slice(0, cursorPositionStart) +
          "![" +
          filename +
          "](" +
          imageInputValue +
          ")" +
          mdText.slice(cursorPositionStart)
      );

      editorRef.current.focus();
      setCursorPositionStart(cursorPositionStart + 2);
      setCursorPositionEnd(cursorPositionEnd + filename.length + 2);
      setCursorPosition(cursorPositionStart, cursorPositionEnd);
    } else {
      editorRef.current.focus();
      setCursorPosition(cursorPositionStart, cursorPositionEnd);
    }
  };

  const handlePreview = (event) => {
    console.log("Previewbutton pressed");
  };

  return (
    <div className="editor">
      <ImageUpload
        uploadImageRef={uploadImageRef}
        editorRef={editorRef}
        imageSubmitHandler={imageSubmitHandler}
      />
      <Header />
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
        handlePreview={handlePreview}
        pushUndoValue={pushUndoValue}
        pushRedoValue={pushRedoValue}
        setMdText={setMdText}
        setCursorPosition={setCursorPosition}
        setCursor={setCursor}
        setButtonValues={setButtonValues}
        setUndoCursorPosition={setUndoCursorPosition}
        setRedoCursorPosition={setRedoCursorPosition}
        setListButtonValues={setListButtonValues}
      />

      <div className="textEditorContainer">
        <MDTextArea
          mdText={mdText}
          editorRef={editorRef}
          onInputChange={handleChange}
          onTextareaKeyDown={onTextareaKeyDown}
          onTextareaKeyUp={onTextareaKeyUp}
          onTextareaMouseDown={onTextareaMouseDown}
          onTextareaSelect={onTextareaSelect}
        />
        <MDPreview mdText={mdText} />
      </div>
    </div>
  );
};

export default Editor;
