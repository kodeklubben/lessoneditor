import React from "react";
import "./smallscreen.css";
import MDTextArea from "./MDTextArea";
import MDPreview from "./MDPreview";
import { mdParser } from "../../../utils/mdParser";
import ControlPanel from "./ControlPanel";
import ControlPanel2 from "./ControlPanel2";
import ControlPanelPreview from "./ControlPanelPreview";
import PageButtons from "../../PageButtons";
import ImagePopup from "../ImagePopup";
import {
  SAVING,
  SAVED,
  SECTION_TEXT,
  PHOTO_TEXT,
  NAV_BUTTONS
} from "../settingsFiles/languages/editor_NO";
import { set } from "mongoose";

// check if buttons is pressed
var isButtonOn = {
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
  sec_protip: true,
  sec_challenge: true,
  sec_flag: true,
  sec_try: true,
  inline: true,
  codeblock: true
};

// Count input char for automatic newline at 80 chars
var charCounter = 0;

var storedTextValue = "";

// helper variable to make list buttons work (atKeyDown : enter)
var listButtonValues = { bTitle: "", output: "", cursorInt: 0 };

var undo = [""];
var undoCursorPosition = [];
var redo = [];
var redoCursorPosition = [];

// temporary store inputtext before updating state
var inputText = "";

// variables to help find cursor in textarea
var cursorPositionStart = 0;
var cursorPositionEnd = 0;

// autosave message, gets updated by autosave
var autoSaveMessage = <br />;

// placeholder tag for picture-upload popup
var imagePopup = <br />;

// ___________________

class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showPreview: false,
      images: [],
      counter: 0,
      textValue: "",
      mdValue: "",
      buttonValues: isButtonOn,
      redirect: null
    };

    // refs are used to find elements in the DOM (simular to document.getElementbyID)
    this.editorRef = React.createRef();
  }

  // counts seconds.  Used with autosave. (simulate backend communication latency)
  componentDidMount() {
    this.myCounter = setInterval(() => {
      this.setState({ counter: this.state.counter + 1 });
    }, 1000);
  }

  // remove counter
  componentWillUnmount() {
    clearInterval(this.myCounter);
  }

  // auto save after a couple of seconds
  componentDidUpdate() {
    if (window.innerWidth > 700 && window.innerHeight / window.innerWidth < 1) {
      this.props.update();
    }
    if (this.state.counter === 2 && this.state.textValue.length > 0) {
      autoSaveMessage = SAVED;
    } else if (this.state.counter === 0) {
      autoSaveMessage = SAVING;
      storedTextValue = this.state.textValue;
    }
  }

  render() {
    // Submithandler
    const mySubmitHandler = event => {
      event.preventDefault();

      console.log("text submitted");

      this.setState({ redirect: "/endpage" });

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
        sec_protip: true,
        sec_challenge: true,
        sec_flag: true,
        sec_try: true,
        inline: true,
        codeblock: true
      };
      this.setState({ buttonValues: isButtonOn });
    };

    const setUndo = () => {
      console.log(undo[undo.length - 1]);
      undo.push(inputText);
      undoCursorPosition.push(cursorPositionStart);
    };

    // sets cursor in textarea
    const setCursorPosition = (positionStart, positionEnd) => {
      setTimeout(() => {
        this.editorRef.current.selectionStart = positionStart;
        this.editorRef.current.selectionEnd = positionEnd;
      }, 0);
    };

    // all config for handling text on input
    const handleChange = event => {
      cursorPositionStart = event.target.selectionStart;
      cursorPositionEnd = event.target.selectionEnd;
      inputText = event.target.value;

      // Counts input char. New line if 80
      charCounter += 1;

      if (charCounter === 80) {
        inputText += "\n";
        charCounter = 0;
      }

      this.setState({ textValue: inputText });
      this.setState({ mdValue: mdParser(inputText) });
      this.setState({ counter: 0 });
    };

    const onTextareaKeyUp = event => {
      cursorPositionStart = event.target.selectionStart;
      cursorPositionEnd = event.target.selectionEnd;

      // some textAreaKeyDown events don't work on smartphones
      // need to make event trigger for those cases here

      // if spacebar, update undo
      if (event.key === " " || event.keyCode === 32) {
        setUndo();
      }
    };

    const onTextareaSelect = e => {
      cursorPositionStart = e.target.selectionStart;
      cursorPositionEnd = e.target.selectionEnd;
    };

    const onTextareaMouseDown = e => {
      cursorPositionStart = e.target.selectionStart;
      cursorPositionEnd = e.target.selectionEnd;

      resetButtons();
    };

    // KEYBOARD SHORTCUT SETTINGS
    const onTextareaKeyDown = event => {
      cursorPositionStart = event.target.selectionStart;
      cursorPositionEnd = event.target.selectionEnd;

      // if input is enter, update undo and do list functions if list.
      if (event.key === "Enter" || event.keyCode === 13) {
        charCounter = 0;
        setUndo();
        if (isButtonOn[listButtonValues["bTitle"]] === false) {
          event.preventDefault();
          if (
            inputText.slice(
              cursorPositionStart - listButtonValues["cursorInt"],
              cursorPositionStart
            ) === listButtonValues["output"]
          ) {
            isButtonOn[listButtonValues["bTitle"]] = true;
            this.setState({ buttonValues: isButtonOn });
            inputText =
              inputText.slice(
                0,
                cursorPositionStart - listButtonValues["cursorInt"]
              ) + inputText.slice(cursorPositionStart);
            this.setState({ textValue: inputText });
            this.setState({ mdValue: mdParser(inputText) });
            setCursorPosition(
              cursorPositionStart - listButtonValues["cursorInt"],
              cursorPositionStart - listButtonValues["cursorInt"]
            );
            return;
          }
          inputText =
            inputText.slice(0, cursorPositionStart) +
            "\n\n" +
            listButtonValues["output"] +
            inputText.slice(cursorPositionStart);
          this.setState({ textValue: inputText });
          this.setState({ mdValue: mdParser(inputText) });
          setCursorPosition(
            cursorPositionStart + listButtonValues["cursorInt"] + 2,
            cursorPositionStart + listButtonValues["cursorInt"] + 2
          );
          return;
        }
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
          this.setState({ textValue: inputText });
          this.setState({ mdValue: mdParser(inputText) });
          cursorPositionStart += 2;
          setCursorPosition(cursorPositionStart, cursorPositionStart);
          return;
        }
        setUndo();
        inputText =
          inputText.slice(0, cursorPositionStart) +
          "  " +
          inputText.slice(cursorPositionEnd);
        this.setState({ textValue: inputText });
        this.setState({ mdValue: mdParser(inputText) });
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

    const storeImage = image => {
      this.setState(prevState => ({ images: [...prevState.images, image] }));
    };

    // Show/hide image popup
    const imagePopupSubmitHandler = imagePopupInputValue => {
      if (imagePopupInputValue) {
        setUndo();
        inputText =
          inputText.slice(0, cursorPositionStart) +
          "![" +
          PHOTO_TEXT +
          "](" +
          imagePopupInputValue +
          ")" +
          inputText.slice(cursorPositionStart);
        this.setState({ textValue: inputText });
        this.setState({ mdValue: mdParser(inputText) });
        this.editorRef.current.focus();
        cursorPositionStart += 2;
        cursorPositionEnd += PHOTO_TEXT.length + 2;
        setCursorPosition(cursorPositionStart, cursorPositionEnd);
        imagePopup = <br />;
        setTimeout(() => {
          console.log(this.state.images);
        }, 100);
      } else {
        imagePopup = <br />;
        this.editorRef.current.focus();
        setCursorPosition(cursorPositionStart, cursorPositionEnd);
      }
    };

    // detect new line and heading value
    const ifNewLine = () => {
      return inputText[cursorPositionStart - 1] === "\n" ||
        inputText === "" ||
        cursorPositionStart === 0 ||
        inputText.slice(cursorPositionStart - 3, cursorPositionStart) ===
          "## " ||
        inputText.slice(cursorPositionStart - 2, cursorPositionStart) === "# "
        ? true
        : false;
    };

    // Button press config method. Keyboard shortcuts also use this method.
    const handleButtonClick = (
      bTitle,
      output,
      cursorIntON,
      cursorIntOFF,
      endOutput
    ) => {
      // move focus to textarea after button click
      this.editorRef.current.focus();
      setCursorPosition(cursorPositionStart, cursorPositionStart);

      // remove all text in textarea and undo/redo variable
      if (bTitle === "new") {
        inputText = "";
        undo = [""];
        redo = [];
        this.setState({ textValue: inputText });
        this.setState({ mdValue: mdParser(inputText) });
        cursorPositionStart = cursorPositionEnd = 0;
        return;
      }

      // Load, save, undo, redo methods
      if (bTitle === "load") {
        inputText = storedTextValue;
        undo = [inputText];
        redo = [inputText];
        this.setState({ textValue: inputText });
        this.setState({ mdValue: mdParser(inputText) });
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
        this.setState({ textValue: inputText });
        this.setState({ mdValue: mdParser(inputText) });
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
        this.setState({ textValue: inputText });
        this.setState({ mdValue: mdParser(inputText) });
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
        this.setState({ buttonValues: isButtonOn });
        setUndo();
        inputText =
          inputText.slice(0, cursorPositionStart - cursorIntON) +
          inputText.slice(cursorPositionStart - cursorIntON + output.length);
        this.setState({ textValue: inputText });
        this.setState({ mdValue: mdParser(inputText) });
        cursorPositionEnd = cursorPositionStart -= cursorIntON;
        setCursorPosition(cursorPositionStart, cursorPositionStart);
        return;
      }

      // make new line if some buttons ares pressed, and it is not allready new line
      if (
        bTitle.slice(0, 4) === "list" ||
        bTitle.slice(0, 4) === "sec_" ||
        (bTitle === "codeblock" && isButtonOn["codeblock"]) ||
        (bTitle === "heading" && isButtonOn["heading"])
      ) {
        if (!ifNewLine()) {
          inputText =
            inputText.slice(0, cursorPositionStart) +
            "\n\n" +
            inputText.slice(cursorPositionStart);
          this.setState({ textValue: inputText });
          this.setState({ mdValue: mdParser(inputText) });
          cursorPositionStart += 2;
          cursorPositionEnd += 2;
          handleButtonClick(
            bTitle,
            output,
            cursorIntON,
            cursorIntOFF,
            endOutput
          );
          return;
        }
        if (bTitle.slice(0, 4) === "list") {
          listButtonValues = {
            bTitle: bTitle,
            output: output,
            cursorInt: cursorIntON
          };
        }
      }

      // image button setting
      if (bTitle === "image") {
        imagePopup = (
          <ImagePopup
            imagePopupSubmitHandler={imagePopupSubmitHandler}
            storeImage={storeImage}
          />
        );
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
          this.setState({ buttonValues: isButtonOn });
          setUndo();
          inputText =
            inputText.slice(0, cursorPositionStart - 3) +
            "# " +
            inputText.slice(cursorPositionStart);
          this.setState({ textValue: inputText });
          this.setState({ mdValue: mdParser(inputText) });
          cursorPositionStart -= 1;
          setCursorPosition(cursorPositionStart, cursorPositionStart);
          return;
        } else if (output === "## " && isButtonOn[bTitle]) {
          setUndo();
          inputText =
            inputText.slice(0, cursorPositionStart) +
            output +
            inputText.slice(cursorPositionStart);

          this.setState({ textValue: inputText });
          this.setState({ mdValue: mdParser(inputText) });
          cursorPositionStart += output.length;
          setCursorPosition(cursorPositionStart, cursorPositionStart);
          return;
        } else if (output === "## " && !isButtonOn[bTitle]) {
          if (
            inputText.slice(cursorPositionStart - 2, cursorPositionStart) ===
            "# "
          ) {
            setUndo();
            inputText =
              inputText.slice(0, cursorPositionStart - 2) +
              inputText.slice(cursorPositionStart);
            this.setState({ textValue: inputText });
            this.setState({ mdValue: mdParser(inputText) });
            cursorPositionStart -= 2;
            setCursorPosition(cursorPositionStart, cursorPositionStart);
            isButtonOn[bTitle] = true;
            this.setState({ buttonValues: isButtonOn });
            return;
          } else {
            isButtonOn[bTitle] = true;
            this.setState({ buttonValues: isButtonOn });
            return;
          }
        }
      }

      // insert section text
      if (bTitle.slice(0, 4) === "sec_" && isButtonOn[bTitle]) {
        isButtonOn[bTitle] = false;
        this.setState({ buttonValues: isButtonOn });
        setUndo();
        inputText =
          inputText.slice(0, cursorPositionStart) +
          output +
          inputText.slice(cursorPositionStart);
        this.setState({ textValue: inputText });
        this.setState({ mdValue: mdParser(inputText) });
        cursorPositionStart += 2;
        cursorPositionEnd += SECTION_TEXT.length + 2;
        setCursorPosition(cursorPositionStart, cursorPositionEnd);
        return;
      }

      //  Button config to insert markdown syntax on button press
      // Config values can be find in :
      // ./settingsFile/buttonConfig.js
      if (isButtonOn[bTitle]) {
        if (cursorPositionStart !== cursorPositionEnd) {
          isButtonOn[bTitle] = false;
          this.setState({ buttonValues: isButtonOn });
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
          this.setState({ textValue: inputText });
          this.setState({ mdValue: mdParser(inputText) });
          setCursorPosition(
            cursorPositionStart + cursorIntON,
            cursorPositionEnd + cursorIntON
          );
          return;
        }
        isButtonOn[bTitle] = false;
        this.setState({ buttonValues: isButtonOn });
        setUndo();
        inputText =
          inputText.slice(0, cursorPositionStart) +
          output +
          inputText.slice(cursorPositionStart);
        this.setState({ textValue: inputText });
        this.setState({ mdValue: mdParser(inputText) });
        setCursorPosition(
          cursorPositionStart + cursorIntON,
          cursorPositionStart + cursorIntON
        );
        return;
      } else if (!isButtonOn[bTitle]) {
        if (cursorPositionStart !== cursorPositionEnd) {
          isButtonOn[bTitle] = true;
          this.setState({ buttonValues: isButtonOn });
          inputText = undo[undo.length - 1];
          this.setState({ textValue: inputText });
          this.setState({ mdValue: mdParser(inputText) });
          setCursorPosition(
            cursorPositionStart - cursorIntON,
            cursorPositionEnd - cursorIntON
          );
          return;
        }
        isButtonOn[bTitle] = true;
        this.setState({ buttonValues: isButtonOn });
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
          this.setState({ textValue: inputText });
          this.setState({ mdValue: mdParser(inputText) });
          cursorPositionStart = cursorPositionEnd += cursorIntOFF;
          setCursorPosition(cursorPositionStart, cursorPositionEnd);
        }
        return;
      } else {
        return;
      }
    };

    const returnPreview = () => {
      if (!this.state.showPreview) {
        this.setState({ showPreview: true });
      } else {
        this.setState({ showPreview: false });
      }
    };

    return (
      <div>
        {!this.state.showPreview ? (
          <div>
            <ControlPanel
              returnPreview={returnPreview}
              handleButtonClick={handleButtonClick}
              nextTitle={NAV_BUTTONS.submit}
              prevValue="/createNewLesson"
              nextValue="/endpage"
              mySubmitHandler={mySubmitHandler}
              state={this.state}
            />
            <div className="">
              <div className="">
                <MDTextArea
                  editorRef={this.editorRef}
                  textValue={this.state.textValue}
                  onInputChange={handleChange}
                  handleButtonClick={handleButtonClick}
                  onTextareaKeyDown={onTextareaKeyDown}
                  onTextareaKeyUp={onTextareaKeyUp}
                  onTextareaMouseDown={onTextareaMouseDown}
                  onTextareaSelect={onTextareaSelect}
                  autoSaveMessage={autoSaveMessage}
                />
              </div>
              {imagePopup}
            </div>
            <footer>
              <ControlPanel2 handleButtonClick={handleButtonClick} />
            </footer>
          </div>
        ) : (
          <div>
            <ControlPanelPreview
              returnPreview={returnPreview}
              handleButtonClick={handleButtonClick}
            />
            <div className="">
              <div className="">
                <MDPreview mdValue={this.state.mdValue} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Editor;
