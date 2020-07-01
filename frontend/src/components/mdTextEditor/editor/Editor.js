import "./editor.css";
import React, { useState, useEffect, useRef, useContext } from "react";
import MDTextArea from "./MDTextArea";
import MDPreview from "../mdPreview/MDPreview";
import { mdParser } from "../../../utils/mdParser";
import ControlPanel from "./controlpanel/ControlPanel";
import ProfileMenu from "../../ProfileMenu";
import ImagePopup from "../ImagePopup";
import {
  SAVING,
  SAVED,
  SECTION_TEXT,
  NAV_BUTTONS,
} from "../settingsFiles/languages/editor_NO";
import {
  SHORTCUTKEY,
  KEY_COMBINATIONS as KEY,
} from "../settingsFiles/buttonConfig";
import { UserContext } from "../../UserContext";

// check if buttons is pressed
let isButtonOn = {
  bold: true,
  italic: true,
  heading: true,
  strikethrough: true,
  undo: true,
  redo: true,
  new: true,
  load: true,
  save: true,
  image: true,
  listUl: true,
  listOl: true,
  listCheck: true,
  sec_activity: true,
  sec_intro: true,
  sec_check: true,
  sec_tip: true,
  sec_protip: true,
  sec_challenge: true,
  sec_flag: true,
  sec_try: true,
  inline: true,
  codeblock: true,
};

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

let undo = [""];
let undoCursorPosition = [];
let redo = [];
let redoCursorPosition = [];

// temporary store inputtext before updating state
let inputText = "";

// variables to help find cursor in textarea
let cursorPositionStart = 0;
let cursorPositionEnd = 0;

// autosave message, gets updated by autosave
let autoSaveMessage = <br />;

// ___________________

const Editor = () => {
  let [state, setState] = useState({
    parseMD: "",
    mdText: "",
    isEditor: true,
    editorRedirect: "",
    images: [],
    counter: 0,
    buttonValues: isButtonOn,
    redirect: null,
  });

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
  useInterval(() => {
    setState((prevState) => ({ ...prevState, counter: state.counter + 1 }));
    if (state.counter > 1 && state.mdText) {
      autoSaveMessage = SAVED;
    } else if (state.counter === 0 && state.mdText) {
      autoSaveMessage = SAVING;
      storedTextValue = state.mdText;
    }
  }, 500);

  // Submithandler
  const submitHandler = (event) => {
    console.log("text submitted");

    setState((prevState) => ({ ...prevState, redirect: "/endpage" }));

    // TODO: Send inputtext-data to database
  };

  const resetButtons = () => {
    isButtonOn = {
      bold: true,
      italic: true,
      heading: true,
      strikethrough: true,
      undo: true,
      redo: true,
      new: true,
      load: true,
      save: true,
      image: true,
      listUl: true,
      listOl: true,
      listCheck: true,
      sec_activity: true,
      sec_intro: true,
      sec_check: true,
      sec_tip: true,
      sec_protip: true,
      sec_challenge: true,
      sec_flag: true,
      sec_try: true,
      inline: true,
      codeblock: true,
    };
    setState((prevState) => ({ ...prevState, buttonValues: isButtonOn }));
  };

  const setUndo = () => {
    if (
      undo[undo.length - 1] !== inputText &&
      undoCursorPosition !== cursorPositionStart
    ) {
      undo.push(inputText);
      undoCursorPosition.push(cursorPositionStart);
    }
  };

  // sets cursor in textarea
  const setCursorPosition = (positionStart, positionEnd) => {
    setTimeout(() => {
      editorRef.current.selectionStart = positionStart;
      editorRef.current.selectionEnd = positionEnd;
    }, 0);
  };

  // all config for handling text on input
  const handleChange = (event) => {
    cursorPositionStart = event.target.selectionStart;
    cursorPositionEnd = event.target.selectionEnd;
    inputText = event.target.value;
    redo = [];

    // some textAreaKeyDown events don't work on smartphones
    // need to make event trigger for those cases here
    // if spacebar, update undo
    if (
      inputText[cursorPositionStart - 1] === " " ||
      inputText[cursorPositionStart - 1] === "\n"
    ) {
      setUndo();
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
    setState((prevState) => ({
      ...prevState,
      mdText: inputText,
      parseMD: mdParser(inputText),
      counter: 0,
    }));
  };

  const onTextareaKeyUp = (event) => {
    cursorPositionStart = event.target.selectionStart;
    cursorPositionEnd = event.target.selectionEnd;
  };

  const onTextareaSelect = (e) => {
    cursorPositionStart = e.target.selectionStart;
    cursorPositionEnd = e.target.selectionEnd;
  };

  const onTextareaMouseDown = (e) => {
    cursorPositionStart = e.target.selectionStart;
    cursorPositionEnd = e.target.selectionEnd;

    resetButtons();
  };

  // KEYBOARD SHORTCUT SETTINGS
  const onTextareaKeyDown = (event) => {
    console.log(event);
    console.log(event.keyCode);
    cursorPositionStart = event.target.selectionStart;
    cursorPositionEnd = event.target.selectionEnd;

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
      setUndo();
    }

    // if input is enter, update undo and do list functions if list.
    if (event.key === "Enter") {
      // charCounter = 0;
      setUndo();
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
            parseMD: mdParser(inputText),
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
          setState((prevState) => ({
            ...prevState,
            mdText: inputText,
            parseMD: mdParser(inputText),
          }));
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
        setState((prevState) => ({
          ...prevState,
          mdText: inputText,
          parseMD: mdParser(inputText),
        }));
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
      if (!isButtonOn["codeblock"]) {
        setUndo();
        inputText =
          inputText.slice(0, cursorPositionStart) +
          "  " +
          inputText.slice(cursorPositionStart);
        setState((prevState) => ({
          ...prevState,
          mdText: inputText,
          parseMD: mdParser(inputText),
        }));
        cursorPositionStart += 2;
        setCursorPosition(cursorPositionStart, cursorPositionStart);
        return;
      }
      setUndo();
      inputText =
        inputText.slice(0, cursorPositionStart) +
        "  " +
        inputText.slice(cursorPositionEnd);
      setState((prevState) => ({
        ...prevState,
        mdText: inputText,
        parseMD: mdParser(inputText),
      }));
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
      setUndo();
      inputText =
        inputText.slice(0, cursorPositionStart) +
        "![" +
        filename +
        "](" +
        imagePopupInputValue +
        ")" +
        inputText.slice(cursorPositionStart);
      setState((prevState) => ({
        ...prevState,
        mdText: inputText,
        parseMD: mdParser(inputText),
      }));
      editorRef.current.focus();
      cursorPositionStart += 2;
      cursorPositionEnd += filename.length + 2;
      setCursorPosition(cursorPositionStart, cursorPositionEnd);
    } else {
      editorRef.current.focus();
      setCursorPosition(cursorPositionStart, cursorPositionEnd);
    }
  };

  // detect new line and heading value
  const ifNewLine = () => {
    return inputText[cursorPositionStart - 1] === "\n" ||
      inputText === "" ||
      cursorPositionStart === 0 ||
      inputText.slice(cursorPositionStart - 3, cursorPositionStart) === "## " ||
      inputText.slice(cursorPositionStart - 2, cursorPositionStart) === "# "
      ? true
      : false;
  };

  // Button press config method. Keyboard shortcuts also use method.
  const handleButtonClick = (
    bTitle,
    output,
    cursorIntON,
    cursorIntOFF,
    endOutput
  ) => {
    // move focus to textarea after button click
    editorRef.current.focus();
    setCursorPosition(cursorPositionStart, cursorPositionStart);

    // remove all text in textarea and undo/redo variable
    if (bTitle === "new") {
      inputText = "";
      undo = [""];
      redo = [];
      setState((prevState) => ({
        ...prevState,
        mdText: inputText,
        parseMD: mdParser(inputText),
      }));
      cursorPositionStart = cursorPositionEnd = 0;
      return;
    }

    // Load, save, undo, redo methods
    if (bTitle === "load") {
      inputText = storedTextValue;
      undo = [inputText];
      redo = [inputText];
      setState((prevState) => ({
        ...prevState,
        mdText: inputText,
        parseMD: mdParser(inputText),
      }));
      setCursorPosition(inputText.length, inputText.length);
      return;
    }

    if (bTitle === "save") {
      storedTextValue = inputText;
      return;
    }

    if (bTitle === "undo") {
      let pos1 = undoCursorPosition.pop();
      let pos2 = pos1;
      if (undo.length <= 0) {
        return;
      }

      redo.push(inputText);
      redoCursorPosition.push(cursorPositionStart);

      inputText = undo.pop();
      setState((prevState) => ({
        ...prevState,
        mdText: inputText,
        parseMD: mdParser(inputText),
      }));
      setCursorPosition(pos1, pos2);
      return;
    }

    if (bTitle === "redo") {
      let pos1 = redoCursorPosition.pop();
      let pos2 = pos1;
      if (redo.length <= 0) {
        return;
      }
      setUndo();
      inputText = redo.pop();
      setState((prevState) => ({
        ...prevState,
        mdText: inputText,
        parseMD: mdParser(inputText),
      }));
      setCursorPosition(pos1, pos2);
      return;
    }

    // cancel button value if pressed second time without textinput
    if (
      !isButtonOn[bTitle] &&
      inputText.slice(
        cursorPositionStart - cursorIntON,
        cursorPositionStart - cursorIntON + output.length
      ) === output
    ) {
      isButtonOn[bTitle] = true;
      setState((prevState) => ({ ...prevState, buttonValues: isButtonOn }));
      setUndo();
      inputText =
        inputText.slice(0, cursorPositionStart - cursorIntON) +
        inputText.slice(cursorPositionStart - cursorIntON + output.length);
      setState((prevState) => ({
        ...prevState,
        mdText: inputText,
        parseMD: mdParser(inputText),
      }));
      cursorPositionEnd = cursorPositionStart -= cursorIntON;
      setCursorPosition(cursorPositionStart, cursorPositionStart);
      return;
    }

    // make new line if some buttons ares pressed, and it is not allready new line
    if (
      bTitle.slice(0, 4) === "list" ||
      (bTitle.slice(0, 4) === "sec_" && isButtonOn[bTitle]) ||
      (bTitle === "codeblock" && isButtonOn["codeblock"]) ||
      (bTitle === "heading" && isButtonOn["heading"])
    ) {
      if (!ifNewLine()) {
        inputText =
          inputText.slice(0, cursorPositionStart) +
          "\n\n" +
          inputText.slice(cursorPositionStart);
        setState((prevState) => ({
          ...prevState,
          mdText: inputText,
          parseMD: mdParser(inputText),
        }));
        cursorPositionStart += 2;
        cursorPositionEnd += 2;
        handleButtonClick(bTitle, output, cursorIntON, cursorIntOFF, endOutput);
        return;
      }
      // save list values to listButtonValues
      // to make list work with "enter-key" in onTextareaKeyDown --> "enter"
      if (bTitle.slice(0, 4) === "list") {
        listButtonValues = {
          bTitle: bTitle,
          output: output,
          cursorInt: cursorIntON,
        };
      }
    }

    // image button setting
    if (bTitle === "image") {
      uploadImageRef.current.click();
      return;
    }

    // Give heading button multiple values
    if (ifNewLine()) {
      if (
        output === "## " &&
        inputText.slice(cursorPositionStart - 3, cursorPositionStart) ===
          output &&
        isButtonOn[bTitle]
      ) {
        isButtonOn[bTitle] = false;
        setState((prevState) => ({ ...prevState, buttonValues: isButtonOn }));
        setUndo();
        inputText =
          inputText.slice(0, cursorPositionStart - 3) +
          "# " +
          inputText.slice(cursorPositionStart);
        setState((prevState) => ({
          ...prevState,
          mdText: inputText,
          parseMD: mdParser(inputText),
        }));
        cursorPositionStart -= 1;
        setCursorPosition(cursorPositionStart, cursorPositionStart);
        return;
      } else if (output === "## " && isButtonOn[bTitle]) {
        setUndo();
        inputText =
          inputText.slice(0, cursorPositionStart) +
          output +
          inputText.slice(cursorPositionStart);

        setState((prevState) => ({
          ...prevState,
          mdText: inputText,
          parseMD: mdParser(inputText),
        }));
        cursorPositionStart += output.length;
        setCursorPosition(cursorPositionStart, cursorPositionStart);
        return;
      } else if (output === "## " && !isButtonOn[bTitle]) {
        if (
          inputText.slice(cursorPositionStart - 2, cursorPositionStart) === "# "
        ) {
          setUndo();
          inputText =
            inputText.slice(0, cursorPositionStart - 2) +
            inputText.slice(cursorPositionStart);
          setState((prevState) => ({
            ...prevState,
            mdText: inputText,
            parseMD: mdParser(inputText),
          }));
          cursorPositionStart -= 2;
          setCursorPosition(cursorPositionStart, cursorPositionStart);
          isButtonOn[bTitle] = true;
          setState((prevState) => ({ ...prevState, buttonValues: isButtonOn }));
          return;
        } else {
          isButtonOn[bTitle] = true;
          setState((prevState) => ({ ...prevState, buttonValues: isButtonOn }));
          return;
        }
      }
    }

    // insert section text
    if (bTitle.slice(0, 4) === "sec_" && isButtonOn[bTitle]) {
      isButtonOn[bTitle] = false;
      setState((prevState) => ({ ...prevState, buttonValues: isButtonOn }));
      setUndo();
      inputText =
        inputText.slice(0, cursorPositionStart) +
        output +
        inputText.slice(cursorPositionStart);
      setState((prevState) => ({
        ...prevState,
        mdText: inputText,
        parseMD: mdParser(inputText),
      }));
      if (output.slice(0, 2) === "##") {
        cursorPositionStart += 3;
        cursorPositionEnd += SECTION_TEXT.length + 3;
      } else if (
        bTitle === "sec_tip" ||
        bTitle === "sec_protip" ||
        bTitle === "sec_challenge"
      ) {
        cursorPositionStart += cursorIntOFF;
        cursorPositionEnd += cursorIntOFF;
      } else {
        cursorPositionStart += 2;
        cursorPositionEnd += SECTION_TEXT.length + 2;
      }
      setCursorPosition(cursorPositionStart, cursorPositionEnd);
      return;
    }

    //  Button config to insert markdown syntax on button press
    // Config values can be find in :
    // ./settingsFile/buttonConfig.js
    if (isButtonOn[bTitle]) {
      if (cursorPositionStart !== cursorPositionEnd) {
        isButtonOn[bTitle] = false;
        setState((prevState) => ({ ...prevState, buttonValues: isButtonOn }));
        let i = inputText.slice(cursorPositionStart, cursorPositionEnd);

        // if text is selected with " " it need to be removed before insert markdown syntax
        // and update cursorPosition at the same time
        while (
          i[0] === " " ||
          i[i.length - 1] === " " ||
          i[0] === "\n" ||
          i[i.length - 1] === "\n"
        ) {
          if (i[0] === " " || i[0] === "\n") {
            i = i.slice(1);
            cursorPositionStart += 1;
          }
          if (i[i.length - 1] === " " || i[i.length - 1] === "\n") {
            i = i.slice(0, i.length - 1);
            cursorPositionEnd -= 1;
          }
        }
        setCursorPosition(cursorPositionStart, cursorPositionEnd);
        setUndo();
        inputText =
          inputText.slice(0, cursorPositionStart) +
          output.slice(0, cursorIntON) +
          i +
          output.slice(cursorIntON) +
          inputText.slice(cursorPositionEnd);
        setState((prevState) => ({
          ...prevState,
          mdText: inputText,
          parseMD: mdParser(inputText),
        }));
        setCursorPosition(
          cursorPositionStart + cursorIntON,
          cursorPositionEnd + cursorIntON
        );
        return;
      }
      isButtonOn[bTitle] = false;
      setState((prevState) => ({ ...prevState, buttonValues: isButtonOn }));

      inputText =
        inputText.slice(0, cursorPositionStart) +
        output +
        inputText.slice(cursorPositionStart);
      setState((prevState) => ({
        ...prevState,
        mdText: inputText,
        parseMD: mdParser(inputText),
      }));
      setUndo();
      setCursorPosition(
        cursorPositionStart + cursorIntON,
        cursorPositionStart + cursorIntON
      );
      return;
    } else if (!isButtonOn[bTitle]) {
      if (cursorPositionStart !== cursorPositionEnd) {
        isButtonOn[bTitle] = true;
        setState((prevState) => ({ ...prevState, buttonValues: isButtonOn }));
        inputText = undo[undo.length - 1];
        setState((prevState) => ({
          ...prevState,
          mdText: inputText,
          parseMD: mdParser(inputText),
        }));
        setCursorPosition(
          cursorPositionStart - cursorIntON,
          cursorPositionEnd - cursorIntON
        );
        return;
      }
      isButtonOn[bTitle] = true;
      setState((prevState) => ({ ...prevState, buttonValues: isButtonOn }));
      setCursorPosition(
        cursorPositionStart + cursorIntOFF,
        cursorPositionEnd + cursorIntOFF
      );
      if (endOutput) {
        setUndo();
        inputText =
          inputText.slice(0, cursorPositionStart + cursorIntOFF) +
          endOutput +
          inputText.slice(cursorPositionStart + cursorIntOFF);
        setState((prevState) => ({
          ...prevState,
          mdText: inputText,
          parseMD: mdParser(inputText),
        }));
        cursorPositionStart = cursorPositionEnd += cursorIntOFF;
        setCursorPosition(cursorPositionStart, cursorPositionEnd);
      }
      return;
    } else {
      return;
    }
  };

  const handlePreview = (event) => {
    if (preview) {
      preview = false;
      return false;
    } else if (!preview) {
      preview = true;
      return true;
    }
  };
  const user = useContext(UserContext);
  return (
    <div className="editor">
      <ImagePopup
        uploadImageRef={uploadImageRef}
        editorRef={editorRef}
        storeImage={storeImage}
        imagePopupSubmitHandler={imagePopupSubmitHandler}
      />

      <div className="profileMenu">
        <ProfileMenu name={user.name} email={user.email} />
      </div>

      <div className="textEditorContainer">
        <p>{autoSaveMessage}</p>
        <ControlPanel
          editorRef={editorRef}
          handleButtonClick={handleButtonClick}
          nextTitle={NAV_BUTTONS.submit}
          prevValue="/createNewLesson"
          nextValue="/endpage"
          submitHandler={submitHandler}
          handlePreview={handlePreview}
          redirect={state.redirect}
          MDTextArea={
            <MDTextArea
              mdText={state.mdText}
              editorRef={editorRef}
              onInputChange={handleChange}
              onTextareaKeyDown={onTextareaKeyDown}
              onTextareaKeyUp={onTextareaKeyUp}
              onTextareaMouseDown={onTextareaMouseDown}
              onTextareaSelect={onTextareaSelect}
              autoSaveMessage={autoSaveMessage}
              handleButtonClick={handleButtonClick}
              handlePreview={handlePreview}
            />
          }
          MDPreview={<MDPreview parseMD={state.parseMD} />}
        ></ControlPanel>
      </div>
    </div>
  );
};

export default Editor;
