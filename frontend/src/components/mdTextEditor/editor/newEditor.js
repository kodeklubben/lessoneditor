import "./editor.css";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import MDTextArea from "./MDTextArea";
import MDPreview from "../mdPreview/MDPreview";
import Emphasis from "./controlpanel/Emphasis";
import UndoRedo from "./controlpanel/UndoRedo";
import Image from "./controlpanel/Image";
import Preview from "./controlpanel/Preview";
import ImagePopup from "../ImagePopup";
import editorButtonsValue from "./editorButtonsValue";
import fetchMdText from "../../../api/fetch-md-text";
import saveMdText from "../../../api/save-md-text";
import {
  NAV_BUTTONS,
  SECTION_TEXT,
} from "../settingsFiles/languages/editor_NO";
import {
  KEY_COMBINATIONS as KEY,
  SHORTCUTKEY,
} from "../settingsFiles/buttonConfig";
import { UserContext } from "../../../contexts/UserContext";
// import { LessonContext } from "../../../contexts/LessonContext";
// check if buttons is pressed
let isButtonOn = editorButtonsValue;

let preview = false;

// dynamic list with all the keyboard shortcut chars from ./settingFiles/buttonConfig.js
let shortcutKeys = [];
for (let i = 0; i < Object.values(KEY).length; i++) {
  shortcutKeys.push(Object.values(KEY)[i][Object.values(KEY)[i].length - 1]);
}

// Count input char for automatic newline at 80 chars
// let charCounter = 0;

let orderedListIndex = 2;

let storedTextValue = "";

// helper variable to make list buttons work (atKeyDown : enter)
let listButtonValues = { bTitle: "", output: "", cursorInt: 0 };

// temporary store inputtext before updating state
let inputText = "";

const setInputText = (text) => {
  inputText = text;
};

// autosave message, gets updated by autosave
// let autoSaveMessage = <br />;

// ___________________

const Editor = () => {
  const context = useContext(UserContext);
  let [state, setState] = useState({
    isEditor: true,
    editorRedirect: "",
    images: [],
    buttonValues: isButtonOn,
    redirect: null,
  });

  const [mdText, setMdText] = useState("");
  const [savedText, setSavedText] = useState("");
  // const lessonContext = useContext(LessonContext);
  const [cursorPositionStart, setCursorPositionStart] = useState(0);
  const [cursorPositionEnd, setCursorPositionEnd] = useState(0);

  const [undo, setUndo] = useState([""]);
  const [redo, setRedo] = useState([]);
  const [undoCursorPosition, setUndoCursorPosition] = useState([]);
  const [redoCursorPosition, setRedoCursorPosition] = useState([]);

  const pushUndoValue = (inputText, cursorPositionStart) => {
    if (
      undo[undo.length - 1] !== inputText &&
      undoCursorPosition !== cursorPositionStart
    ) {
      setUndo((undo) => [...undo, inputText]);
      setUndoCursorPosition((undoCursorPosition) => [
        ...undoCursorPosition,
        cursorPositionStart,
      ]);
      setMdText(redo[redo.length - 1]);
      setRedo(redo.slice(0, redo.length - 1));
    }
  };

  const pushRedoValue = (inputText, cursorPositionStart) => {
    if (
      redo[redo.length] !== inputText &&
      redoCursorPosition !== cursorPositionStart
    ) {
      setRedo((redo) => [...redo, inputText]);
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
  const { course, lesson, file } = useParams();

  const ifNewLine = (inputText) => {
    return (
      inputText[cursorPositionStart - 1] === "\n" ||
      inputText === "" ||
      cursorPositionStart === 0
    );
  };

  useEffect(() => {
    if (course && lesson && file) {
      async function fetchData() {
        let mdText = await fetchMdText(course, lesson, file);
        setSavedText(mdText);
        setMdText(mdText);
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

  // refs are used to find elements in the DOM (simular to document.getElementbyID)
  let editorRef = useRef();
  let uploadImageRef = useRef();

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

  // counts seconds.  Used with autosave. (simulate backend communication latency)
  // useInterval(() => {
  //   setState(prevState => ({ ...prevState, counter: state.counter + 1 }));
  //   if (state.counter > 1 && state.mdText) {
  //     autoSaveMessage = SAVED;
  //   } else if (state.counter === 0 && state.mdText) {
  //     autoSaveMessage = SAVING;
  //     storedTextValue = state.mdText;
  //   }
  // }, 500);

  // Submithandler
  const submitHandler = (event) => {
    console.log("text submitted");

    setState((prevState) => ({ ...prevState, redirect: "/endpage" }));

    // TODO: Send inputtext-data to database
  };

  const resetButtons = () => {
    isButtonOn = editorButtonsValue;
    setState((prevState) => ({ ...prevState, buttonValues: isButtonOn }));
  };

  // sets cursor in textarea
  const setCursorPosition = async (positionStart, positionEnd) => {
    editorRef.current.selectionStart = await positionStart;
    editorRef.current.selectionEnd = await positionEnd;
  };

  // all config for handling text on input
  const handleChange = async (event) => {
    setCursor(event.target.selectionStart, event.target.selectionEnd);
    inputText = event.target.value;
    // redo = [];

    // some textAreaKeyDown events don't work on smartphones
    // need to make event trigger for those cases here
    // if spacebar, update undo
    if (
      inputText[cursorPositionStart] === " " ||
      inputText[cursorPositionStart] === "\n"
    ) {
      pushUndoValue(inputText, cursorPositionStart);
    }

    // Counts input char. New line if 80
    // charCounter += 1;

    // if (charCounter === 80) {
    //   inputText =
    //     inputText.slice(0, cursorPositionStart) +
    //     "\n" +
    //     inputText.slice(cursorPositionStart);
    //   setCursorPosition(cursorPositionStart + 1, cursorPositionEnd + 1);
    //   charCounter = 0;
    // }

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

  // KEYBOARD SHORTCUT SETTINGS
  const onTextareaKeyDown = (event) => {
    setCursor(event.target.selectionStart, event.target.selectionEnd);

    // prevents default value on shortcut keys
    if (
      (event.ctrlKey && SHORTCUTKEY === "ctrl") ||
      (event.altKey && SHORTCUTKEY === "alt") ||
      (event.metaKey && SHORTCUTKEY === "command") ||
      (event.shiftKey && SHORTCUTKEY === "shift")
    ) {
      if (shortcutKeys.includes(event.key)) {
        event.preventDefault();
      }
    }

    // if spacebar, update undo
    if (event.key === " ") {
      // pushUndoValue(inputText, cursorPositionStart);
    }

    // if input is enter, update undo and do list functions if list.
    if (event.key === "Enter") {
      // charCounter = 0;
      // pushUndoValue(inputText, cursorPositionStart);
      if (
        !isButtonOn[listButtonValues["bTitle"]] &&
        listButtonValues["bTitle"]
      ) {
        event.preventDefault();
        if (
          inputText.slice(
            cursorPositionStart - listButtonValues["cursorInt"],
            cursorPositionStart
          ) === listButtonValues["output"] ||
          inputText.slice(
            cursorPositionStart - listButtonValues["cursorInt"],
            cursorPositionStart
          ) ===
            orderedListIndex - 1 + ". "
        ) {
          isButtonOn[listButtonValues["bTitle"]] = true;
          inputText =
            inputText.slice(
              0,
              cursorPositionStart - listButtonValues["cursorInt"]
            ) + inputText.slice(cursorPositionStart);
          setState((prevState) => ({
            ...prevState,
            mdText: inputText,
            buttonValues: isButtonOn,
          }));
          setCursorPosition(
            cursorPositionStart - listButtonValues["cursorInt"],
            cursorPositionStart - listButtonValues["cursorInt"]
          );
          orderedListIndex = 2;
          return;
        }
        if (listButtonValues["bTitle"] === "listOl") {
          inputText =
            inputText.slice(0, cursorPositionStart) +
            "\n\n" +
            (orderedListIndex + ". ") +
            inputText.slice(cursorPositionStart);
          setMdText(inputText);
          setCursorPosition(
            cursorPositionStart + listButtonValues["cursorInt"] + 2,
            cursorPositionStart + listButtonValues["cursorInt"] + 2
          );
          orderedListIndex++;
          return;
        }

        inputText =
          inputText.slice(0, cursorPositionStart) +
          "\n\n" +
          listButtonValues["output"] +
          inputText.slice(cursorPositionStart);
        setMdText(inputText);
        setCursorPosition(
          cursorPositionStart + listButtonValues["cursorInt"] + 2,
          cursorPositionStart + listButtonValues["cursorInt"] + 2
        );
        return;
      }
      // needed to make heading button give multiple outputs on enter t
      if (!isButtonOn["heading"]) {
        isButtonOn["heading"] = true;
      }
    }

    // tab gives to char ident space. Also in codeblock
    if (event.key === "Tab") {
      event.preventDefault();
      // config for correct tab inside codeblock:

      // pushUndoValue(inputText, cursorPositionStart);
      inputText =
        inputText.slice(0, cursorPositionStart) +
        "  " +
        inputText.slice(cursorPositionStart);
      setMdText(inputText);
      setCursorPositionStart(cursorPositionStart + 2);
      setCursorPosition(cursorPositionStart, cursorPositionStart);
      return;
    }

    // reset buttons if arrow keys are pressed
    if (
      event.key === "ArrowLeft" ||
      event.key === "ArrowUp" ||
      event.key === "ArrowRight" ||
      event.key === "ArrowDown"
    ) {
      resetButtons();
    }
  };

  const storeImage = (image) => {
    setState((prevState) => ({
      ...prevState,
      images: [...prevState.images, image],
    }));
  };

  // Show/hide image popup
  const imagePopupSubmitHandler = (imagePopupInputValue, filename) => {
    if (imagePopupInputValue) {
      // pushUndoValue(inputText, cursorPositionStart);
      inputText =
        inputText.slice(0, cursorPositionStart) +
        "![" +
        filename +
        "](" +
        imagePopupInputValue +
        ")" +
        inputText.slice(cursorPositionStart);
      setMdText(inputText);
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
    alert("Preview");
    if (preview) {
      preview = false;
      return false;
    } else if (!preview) {
      preview = true;
      return true;
    }
  };

  return (
    <div className="editor">
      <p>New Editor</p>
      <ImagePopup
        uploadImageRef={uploadImageRef}
        editorRef={editorRef}
        storeImage={storeImage}
        imagePopupSubmitHandler={imagePopupSubmitHandler}
      />

      <div className="textEditorContainer">
        <Emphasis
          editorRef={editorRef}
          inputText={inputText}
          cursorPositionStart={cursorPositionStart}
          cursorPositionEnd={cursorPositionEnd}
          mdText={mdText}
          setMdText={setMdText}
          setCursorPosition={setCursorPosition}
          setCursor={setCursor}
          setInputText={setInputText}
        />
        <UndoRedo
          editorRef={editorRef}
          mdText={mdText}
          undo={undo}
          redo={redo}
          undoCursorPosition={undoCursorPosition}
          setUndoCursorPosition={setUndoCursorPosition}
          redoCursorPosition={redoCursorPosition}
          setRedoCursorPosition={setRedoCursorPosition}
          pushUndoValue={pushUndoValue}
          pushRedoValue={pushRedoValue}
          setCursorPosition={setCursorPosition}
          cursorPositionStart={cursorPositionStart}
          cursorPositionEnd={cursorPositionEnd}
        />
        <Image editorRef={editorRef} uploadImageRef={uploadImageRef} />
        <Preview handlePreview={handlePreview} />
        <MDTextArea
          mdText={mdText}
          editorRef={editorRef}
          onInputChange={handleChange}
          onTextareaKeyDown={onTextareaKeyDown}
          onTextareaKeyUp={onTextareaKeyUp}
          onTextareaMouseDown={onTextareaMouseDown}
          onTextareaSelect={onTextareaSelect}
          handlePreview={handlePreview}
        />
        <MDPreview mdText={mdText} />
      </div>
    </div>
  );
};

export default Editor;