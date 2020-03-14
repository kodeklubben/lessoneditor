import React from "react";
import "../../index.css";
import MDTextArea from "./MDTextArea";
import MDPreview from "./MDPreview";
import { mdParser } from "../../utils/mdParser";
import ControlPanel from "./ControlPanel";
import PageButtons from "../PageButtons";
import ImagePopup from "./ImagePopup";
// import { Redirect } from "react-router-dom";

// variabler som sjekker om en knapp er trykket ned:
var buttonBoolValues = {
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
  checklist: true,
  activity: true,
  intro: true,
  inline: true,
  codeblock: true
};

// Hjelpevariabel for å formatere string taste-shortcut.
const temp = "```";

// Teller input-tegn for automatisk linjeksift etter 80 tegn
var charCounter = 0;

// Variabel for å spesifisere hoved-hurtigtast til React Hotkeys (tastesnarveier)
var OSspecificKey = "ctrl+";

var storedTextValue = "";

// undo/redo - variabler.
var undo = [""];
var redo = [];

var inputText = "";
var cursorPositionStart = 0;
var cursorPositionEnd = 0;

// meldingen i autosave
var autoSaveMessage = <br />;

var imagePopup = <br />;

// ___________________

class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      counter: 0,
      textValue: "",
      mdValue: "",
      boolButton: buttonBoolValues
    };

    // referanseVariabel (type: GetDocumentByID i vanlig JS) for Textarea-elementet i DOM.  Tillater å manipulere DOM i react
    // brukes her til å flytte fokus fra knapp tilbake til textarea
    this.editorRef = React.createRef();
  }

  componentDidMount() {
    this.myCounter = setInterval(() => {
      this.setState({ counter: this.state.counter + 1 });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.myCounter);
  }

  componentDidUpdate() {
    if (this.state.counter === 2 && this.state.textValue.length > 0) {
      autoSaveMessage = "document saved";
    } else if (this.state.counter === 0) {
      autoSaveMessage = "saving..";
      storedTextValue = this.state.textValue;
    }
  }

  render() {
    // all config for å behandle tekst i textarea
    const handleChange = event => {
      cursorPositionStart = event.target.selectionStart;
      cursorPositionEnd = event.target.selectionEnd;
      inputText = event.target.value;

      // hvis tekstinput er mellomrom eller enter, lagres event.target.value til undo:
      if (
        event.target.value.charCodeAt(event.target.value.length - 1) === 32 ||
        event.target.value.charCodeAt(event.target.value.length - 1) === 10
      ) {
        undo = [...undo, inputText];
      }

      // Teller input-tegn, og tvinger linjeskift hvis det passerer 80 tegn
      charCounter += 1;

      if (event.target.value.charCodeAt(event.target.value.length - 1) === 10) {
        charCounter = 0;
      }

      if (charCounter === 80) {
        inputText += "\n";
        charCounter = 0;
      }

      // dytter tekstinput til state for å re-rendre siden.
      this.setState({ textValue: inputText });
      this.setState({ mdValue: mdParser(inputText) });
      this.setState({ counter: 0 });
    };

    const onTextareaKeyUp = e => {
      cursorPositionStart = e.target.selectionStart;
      cursorPositionEnd = e.target.selectionEnd;
    };

    const onTextareaSelect = e => {
      cursorPositionStart = e.target.selectionStart;
      cursorPositionEnd = e.target.selectionEnd;
    };

    const onTextareaClick = e => {
      cursorPositionStart = e.target.selectionStart;
      cursorPositionEnd = e.target.selectionEnd;

      buttonBoolValues = {
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
        checklist: true,
        activity: true,
        intro: true,
        inline: true,
        codeblock: true
      };
    };

    // konfigurering for å fjerne default-funksjoner av tastekombinasjoner
    // brukes for å sette egne hurtigtaster i teksteditor.
    const onTextareaKeyDown = e => {
      cursorPositionStart = e.target.selectionStart;
      cursorPositionEnd = e.target.selectionEnd;

      // 66 = "b"
      if (e.ctrlKey && e.keyCode === 66) {
        e.preventDefault();
      }

      // 73 = "i"
      if (e.ctrlKey && e.keyCode === 73) {
        e.preventDefault();
      }

      // 72 = "h"
      if (e.ctrlKey && e.keyCode === 72) {
        e.preventDefault();
      }

      // 188 = "z"
      if (e.ctrlKey && e.keyCode === 188) {
        e.preventDefault();
      }

      if (e.ctrlKey && e.shiftKey && e.keyCode === 188) {
        e.preventDefault();
      }

      // 8 = "backspace"
      if (e.ctrlKey && e.shiftKey && e.keyCode === 8) {
        e.preventDefault();
      }

      // 76 = "l"
      if (e.ctrlKey && e.shiftKey && e.keyCode === 76) {
        e.preventDefault();
      }

      // 83 = "s"
      if (e.ctrlKey && e.shiftKey && e.keyCode === 83) {
        e.preventDefault();
      }

      // 80 = "p"
      if (e.ctrlKey && e.keyCode === 80) {
        e.preventDefault();
      }

      // 85 = "u"
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
      }
      if (e.ctrlKey && e.shiftKey && e.keyCode === 85) {
        e.preventDefault();
      }

      // 89 = "y"
      if (e.ctrlKey && e.keyCode === 89) {
        e.preventDefault();
      }

      // 65 = "a"
      if (e.ctrlKey && e.shiftKey && e.keyCode === 65) {
        e.preventDefault();
      }

      // 73 = "i"
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
      }

      // 69 = "e"
      if (e.ctrlKey && e.keyCode === 69) {
        e.preventDefault();
      }

      // 75 = "k"
      if (e.ctrlKey && e.keyCode === 75) {
        e.preventDefault();
      }

      // 9 = "tab"
      if (e.keyCode === 9) {
        e.preventDefault();
        // config for correct tab inside codeblock:
        if (!buttonBoolValues["codeblock"]) {
          inputText =
            inputText.slice(0, cursorPositionStart) +
            "  " +
            inputText.slice(cursorPositionStart);
          this.setState({ textValue: inputText });
          cursorPositionStart += 2;
          setCursorPosition(cursorPositionStart, cursorPositionStart);
          return;
        }
        inputText += "  ";
        this.setState({ textValue: inputText });
      }
    };

    // Vise, skjule image-button-popup
    const imagePopupSubmitHandler = imagePopupInputValue => {
      if (imagePopupInputValue) {
        inputText =
          inputText.slice(0, cursorPositionStart) +
          "![Bildebeskrivelse her](" +
          imagePopupInputValue +
          ")" +
          inputText.slice(cursorPositionStart);
        this.setState({ textValue: inputText });
        this.editorRef.current.focus();
        cursorPositionStart += 2;
        cursorPositionEnd += 22;
        setCursorPosition(cursorPositionStart, cursorPositionEnd);
        imagePopup = <br />;
      }
    };

    // angi markørposisjon i tekstfelt
    const setCursorPosition = (positionStart, positionEnd) => {
      setTimeout(() => {
        this.editorRef.current.selectionStart = positionStart;
        this.editorRef.current.selectionEnd = positionEnd;
      }, 0);
    };

    // litt logikk for å detektere linjeskift ++
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

    // funksjon som konfigurerer hva som skjer når man trykker på knapper i teksteditor
    // hurtigtast-trykk sendes også til denne funksjonen
    const handleButtonClick = (
      bTitle,
      output,
      cursorIntON,
      cursorIntOFF,
      endOutput
    ) => {
      // flytte fokus til tekstvindu etter button-click
      this.editorRef.current.focus();
      setCursorPosition(cursorPositionStart, cursorPositionStart);

      // fjerner all tekst i editor og undo/redo-variablene
      if (bTitle === "new") {
        inputText = "";
        undo = [""];
        redo = [];
        this.setState({ textValue: inputText });
        this.setState({ mdValue: mdParser(inputText) });
        return;
      }

      // Load, save, undo, redo funksjoner

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
        if (undo.length <= 0) {
          return;
        }
        redo = [...redo, inputText];
        inputText = undo.pop();
        this.setState({ textValue: inputText });
        this.setState({ mdValue: mdParser(inputText) });
        setCursorPosition(inputText.length, inputText.length);
        return;
      }

      if (bTitle === "redo") {
        if (redo.length <= 0) {
          return;
        }
        undo = [...undo, inputText];
        inputText = redo.pop();
        this.setState({ textValue: inputText });
        this.setState({ mdValue: mdParser(inputText) });
        setCursorPosition(inputText.length, inputText.length);
        return;
      }

      if (bTitle === "image") {
        imagePopup = (
          <ImagePopup imagePopupSubmitHandler={imagePopupSubmitHandler} />
        );
        return;
      }

      // Config for å gi "heading" flere verdier på en knapp
      if (ifNewLine()) {
        if (
          output === "## " &&
          inputText.slice(cursorPositionStart - 3, cursorPositionStart) ===
            output &&
          buttonBoolValues[bTitle]
        ) {
          buttonBoolValues[bTitle] = false;
          this.setState({ boolButton: buttonBoolValues });
          inputText =
            inputText.slice(0, cursorPositionStart - 3) +
            "# " +
            inputText.slice(cursorPositionStart);
          this.setState({ textValue: inputText });
          this.setState({ mdValue: mdParser(inputText) });
          cursorPositionStart -= 1;
          setCursorPosition(cursorPositionStart, cursorPositionStart);
          return;
        } else if (output === "## " && buttonBoolValues[bTitle]) {
          inputText =
            inputText.slice(0, cursorPositionStart) +
            output +
            inputText.slice(cursorPositionStart);

          this.setState({ textValue: inputText });
          this.setState({ mdValue: mdParser(inputText) });
          cursorPositionStart += output.length;
          setCursorPosition(cursorPositionStart, cursorPositionStart);
          return;
        } else if (output === "## " && !buttonBoolValues[bTitle]) {
          if (
            inputText.slice(cursorPositionStart - 2, cursorPositionStart) ===
            "# "
          ) {
            inputText =
              inputText.slice(0, cursorPositionStart - 2) +
              inputText.slice(cursorPositionStart);
            this.setState({ textValue: inputText });
            this.setState({ mdValue: mdParser(inputText) });
            cursorPositionStart -= 2;
            setCursorPosition(cursorPositionStart, cursorPositionStart);
            buttonBoolValues[bTitle] = true;
            this.setState({ boolButton: buttonBoolValues });
            return;
          } else {
            buttonBoolValues[bTitle] = true;
            this.setState({ boolButton: buttonBoolValues });
            return;
          }
        }
      }

      //constraint button from working if not new line
      if (
        bTitle === "heading" ||
        (bTitle === "codeblock" &&
          buttonBoolValues["codeblock"] &&
          !ifNewLine())
      ) {
        return;
      }

      //constraint button from working if new line
      if (
        (bTitle === "activity" && ifNewLine()) ||
        (bTitle === "intro" && ifNewLine())
      ) {
        return;
      }

      // nuller ut verdi fra knapp-trykk om man trykker en gang til på knapp uten å ha skrevet noen tegn.
      // kanselerer da ut første knappetrykket.
      if (
        !buttonBoolValues[bTitle] &&
        inputText.slice(
          cursorPositionStart - cursorIntON,
          cursorPositionStart - cursorIntON + output.length
        ) === output
      ) {
        buttonBoolValues[bTitle] = true;
        this.setState({ boolButton: buttonBoolValues });
        inputText =
          inputText.slice(0, cursorPositionStart - cursorIntON) +
          inputText.slice(cursorPositionStart - cursorIntON + output.length);
        this.setState({ textValue: inputText });
        this.setState({ mdValue: mdParser(inputText) });
        cursorPositionEnd = cursorPositionStart -= cursorIntON;
        setCursorPosition(cursorPositionStart, cursorPositionStart);
        return;
      }

      //  Konfig av knapper slik at de registrerer om de er trykket, og flytter tekst-markøren i henhold til hvordan MD-syntax ser ut
      // Konfig-data finnes i ./buttonConfig.js der tallverdi for hvor mye tekst-markøren skal flyttes er definert in "cursorIntON" og "cursorIntOFF"

      if (buttonBoolValues[bTitle]) {
        if (cursorPositionStart !== cursorPositionEnd) {
          buttonBoolValues[bTitle] = false;
          this.setState({ boolButton: buttonBoolValues });
          let i = inputText.slice(cursorPositionStart, cursorPositionEnd);
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
              i = i.slice(0, i.length - 2);
              cursorPositionEnd -= 2;
            }
          }
          setCursorPosition(cursorPositionStart, cursorPositionEnd);
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
        buttonBoolValues[bTitle] = false;
        this.setState({ boolButton: buttonBoolValues });
        inputText =
          inputText.slice(0, cursorPositionStart) +
          output +
          inputText.slice(cursorPositionStart);
        this.setState({ textValue: inputText });
        this.setState({ mdValue: mdParser(inputText) });
        cursorPositionStart = cursorPositionStart + cursorIntON;
        setCursorPosition(cursorPositionStart, cursorPositionStart);
        return;
      } else if (!buttonBoolValues[bTitle]) {
        buttonBoolValues[bTitle] = true;
        this.setState({ boolButton: buttonBoolValues });
        setCursorPosition(
          cursorPositionEnd + cursorIntOFF,
          cursorPositionEnd + cursorIntOFF
        );
        if (endOutput) {
          inputText =
            inputText.slice(0, cursorPositionStart + cursorIntOFF) +
            endOutput +
            inputText.slice(cursorPositionStart + cursorIntOFF);
          this.setState({ textValue: inputText });
          this.setState({ mdValue: mdParser(inputText) });
          cursorPositionStart += cursorIntOFF;
          setCursorPosition(cursorPositionStart, cursorPositionStart);
        }
        return;
      } else {
        // inputText =
        //   inputText.slice(0, cursorPositionStart) +
        //   output +
        //   inputText.slice(cursorPositionStart);
        // this.setState({ textValue: inputText });
        // setCursorPosition(cursorPositionStart, cursorPositionStart);
        return;
      }
    };

    // Submithandler,  kode for å sende tekst til backend skrives her her.
    const mySubmitHandler = event => {
      event.preventDefault();

      // TODO: Send inputtext-data to database
    };

    // Kode for å lage snarveier på tastatur.
    const keyMap = {
      BOLD: OSspecificKey + "b",
      ITALIC: OSspecificKey + "i",
      HEADING: OSspecificKey + "h",
      STRIKETHROUGH: OSspecificKey + "s",
      UNDO: OSspecificKey + "z",
      REDO: OSspecificKey + "shift+z",
      NEW: OSspecificKey + "shift+backspace",
      LOAD: OSspecificKey + "shift+l",
      SAVE: OSspecificKey + "shift+s",
      IMAGE: OSspecificKey + "p",
      LISTUL: OSspecificKey + "u",
      LISTOL: OSspecificKey + "shift+u",
      CHECKLIST: OSspecificKey + "y",
      ACTIVITY: OSspecificKey + "shift+a",
      INTRO: OSspecificKey + "shift+i",
      INLINE: OSspecificKey + "e",
      CODEBLOCK: OSspecificKey + "k"
    };

    // Hva som skjer når man trykker en hurtigtastetrykk.
    // kaller samme funksjon som når man trykker på tilsvarende knapper med tilsvarende verdier (finnes i buttonConfig.js)
    const handlers = {
      BOLD: () => handleButtonClick("bold", "****", 2, 2, ""),
      ITALIC: () => handleButtonClick("italic", " __ ", 2, 2, ""),
      HEADING: () => handleButtonClick("heading", "## ", 0, 0, ""),
      STRIKETHROUGH: () => handleButtonClick("strikethrough", "~~~~", 2, 2, ""),
      UNDO: () => handleButtonClick("undo", "", 0, 0, ""),
      REDO: () => handleButtonClick("redo", "", 0, 0, ""),
      NEW: () => handleButtonClick("new", "", 0, 0, ""),
      LOAD: () => handleButtonClick("load", "", 0, 0, ""),
      SAVE: () => handleButtonClick("save", "", 0, 0, ""),
      IMAGE: () => handleButtonClick("image", "", 0, 0, ""),
      LISTUL: () => handleButtonClick("listul", "- ", 0, 0, ""),
      LISTOL: () => handleButtonClick("listol", "1. ", 0, 0, ""),
      CHECKLIST: () => handleButtonClick("checklist", "- [ ]", 0, 0, ""),
      ACTIVITY: () => handleButtonClick("activity", "{.activity}", 0, 0, ""),
      INTRO: () => handleButtonClick("intro", "{.intro}", 0, 0, ""),
      INLINE: () => handleButtonClick("inline", "``", 1, 1, ""),
      CODEBLOCK: () =>
        handleButtonClick("codeblock", `${temp}\n\n${temp}`, 4, 5, "\n")
    };

    return (
      <div className="Editor">
        <div className="controlPanelPlacement">
          <ControlPanel handleButtonClick={handleButtonClick} />

          <div className="ui two column test grid container">
            <div className="column">
              <MDTextArea
                editorRef={this.editorRef}
                textValue={this.state.textValue}
                onInputChange={handleChange}
                handleButtonClick={handleButtonClick}
                onTextareaKeyDown={onTextareaKeyDown}
                onTextareaKeyUp={onTextareaKeyUp}
                onTextareaClick={onTextareaClick}
                onTextareaSelect={onTextareaSelect}
                handlers={handlers}
                keyMap={keyMap}
              />
            </div>
            {imagePopup}
            <div className="column">
              <MDPreview mdValue={this.state.mdValue} />
            </div>
          </div>
        </div>
        <div className="ui autosave container">
          <div className="autosave">
            <p style={{ color: "grey" }}>{autoSaveMessage}</p>
          </div>
        </div>
        <div className="ui container">
          <PageButtons
            prevTitle="Tilbake"
            nextTitle="Submit"
            prevValue="/createNewLesson"
            nextValue="/endpage"
            mySubmitHandler={mySubmitHandler}
          />
        </div>
      </div>
    );
  }
}

export default Editor;
