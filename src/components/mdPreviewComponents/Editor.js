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

const objectKeys = Object.keys(buttonBoolValues);

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
var cursorPosition = 0;

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
      cursorPosition = e.target.selectionStart;
    };

    const onTextareaClick = e => {
      for (let x in objectKeys) {
        buttonBoolValues[x] = true;
      }
    };

    // konfigurering for å fjerne default-funksjoner av tastekombinasjoner
    // brukes for å sette egne hurtigtaster i teksteditor.
    const onTextareaKeyDown = e => {
      cursorPosition = e.target.selectionStart;

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
          let i = inputText.slice(0, cursorPosition - 4);
          inputText = i + "  \n" + temp;
          setCursorPosition(cursorPosition, cursorPosition);
          return;
        }
        inputText += "  ";
        this.setState({ textValue: inputText });
      }
    };

    // Vise, skjule image-button-popup
    const imagePopupSubmitHandler = imagePopupInputValue => {
      if (imagePopupInputValue) {
        inputText += "\n![Bildebeskrivelse her](" + imagePopupInputValue + ")";
        this.setState({ textValue: inputText });

        setTimeout(() => {
          this.editorRef.current.selectionStart =
            cursorPosition - imagePopupInputValue.length + 23;
          this.editorRef.current.selectionEnd =
            cursorPosition - imagePopupInputValue.length + 3;
        }, 0);
      }
      imagePopup = <br />;
      this.editorRef.current.focus();
      setCursorPosition(cursorPosition, cursorPosition);
    };

    // litt logikk for å detektere linjeskift ++
    const ifNewLine = () => {
      console.log(inputText[0]);
      return inputText[cursorPosition - 1] === "\n" ||
        inputText === "" ||
        (inputText.charAt(cursorPosition) === "" && cursorPosition === 0) ||
        inputText.slice(cursorPosition - 3, cursorPosition) === "## " ||
        inputText.slice(cursorPosition - 2, cursorPosition) === "# "
        ? true
        : false;
    };

    // angi markørposisjon i tekstfelt
    const setCursorPosition = (positionStart, positionEnd) => {
      setTimeout(() => {
        this.editorRef.current.selectionStart = positionStart;
        this.editorRef.current.selectionEnd = positionEnd;
      }, 0);
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
      setCursorPosition(cursorPosition, cursorPosition);

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
        setCursorPosition(inputText.length);
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
        setCursorPosition(inputText.length);
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
          inputText.slice(cursorPosition - 3, cursorPosition) === output &&
          buttonBoolValues[bTitle]
        ) {
          buttonBoolValues[bTitle] = false;
          inputText =
            inputText.slice(0, cursorPosition - 3) +
            "# " +
            inputText.slice(cursorPosition);
          this.setState({ textValue: inputText });
          cursorPosition -= 1;
          setCursorPosition(cursorPosition, cursorPosition);
          return;
        } else if (output === "## " && buttonBoolValues[bTitle]) {
          inputText =
            inputText.slice(0, cursorPosition) +
            output +
            inputText.slice(cursorPosition);

          this.setState({ textValue: inputText });
          cursorPosition += output.length;
          setCursorPosition(cursorPosition, cursorPosition);
          return;
        } else if (output === "## " && !buttonBoolValues[bTitle]) {
          if (inputText.slice(cursorPosition - 2, cursorPosition) === "# ") {
            inputText =
              inputText.slice(0, cursorPosition - 2) +
              inputText.slice(cursorPosition);
            this.setState({ textValue: inputText });
            cursorPosition -= 2;
            setCursorPosition(cursorPosition, cursorPosition);
            buttonBoolValues[bTitle] = true;
            return;
          } else {
            buttonBoolValues[bTitle] = true;
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
        inputText.slice(
          cursorPosition + cursorIntON - output.length,
          cursorPosition + cursorIntON
        ) === output &&
        !buttonBoolValues[bTitle]
      ) {
        inputText =
          inputText.slice(0, cursorPosition + cursorIntON - output.length) +
          inputText.slice(cursorPosition + cursorIntON);
        this.setState({ textValue: inputText });
        cursorPosition -= cursorIntON;
        setCursorPosition(cursorPosition, cursorPosition);
        buttonBoolValues[bTitle] = true;
        return;
      }

      //  Konfig av knapper slik at de registrerer om de er trykket, og flytter tekst-markøren i henhold til hvordan MD-syntax ser ut
      // Konfig-data finnes i ./buttonConfig.js der tallverdi for hvor mye tekst-markøren skal flyttes er definert in "cursorIntON" og "cursorIntOFF"

      if (buttonBoolValues[bTitle]) {
        buttonBoolValues[bTitle] = false;
        inputText =
          inputText.slice(0, cursorPosition) +
          output +
          inputText.slice(cursorPosition);
        this.setState({ textValue: inputText });
        cursorPosition = cursorPosition + cursorIntON;
        setCursorPosition(cursorPosition, cursorPosition);
        this.setState({ boolButton: buttonBoolValues });
        return;
      } else if (!buttonBoolValues[bTitle]) {
        buttonBoolValues[bTitle] = true;
        setCursorPosition(
          cursorPosition + cursorIntON,
          cursorPosition + cursorIntOFF
        );
        if (endOutput) {
          inputText =
            inputText.slice(0, cursorPosition + cursorIntOFF) +
            endOutput +
            inputText.slice(cursorPosition + cursorIntOFF);
          this.setState({ textValue: inputText });
          cursorPosition += cursorIntOFF;
          setCursorPosition(cursorPosition, cursorPosition);
        }
        this.setState({ boolButton: buttonBoolValues });
        return;
      } else {
        inputText =
          inputText.slice(0, cursorPosition) +
          output +
          inputText.slice(cursorPosition);
        this.setState({ textValue: inputText });
        setCursorPosition(cursorPosition, cursorPosition);
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
      ITALIC: () => handleButtonClick("italic", "__ ", 2, 2, ""),
      HEADING: () => handleButtonClick("heading", "## ", 2, 2, ""),
      UNDO: () => handleButtonClick("undo", "", null, null, ""),
      REDO: () => handleButtonClick("redo", "", null, null, ""),
      NEW: () => handleButtonClick("new", "", null, null, ""),
      LOAD: () => handleButtonClick("load", "", null, null, ""),
      SAVE: () => handleButtonClick("save", "", null, null, ""),
      IMAGE: () => handleButtonClick("image", "", null, null, ""),
      LISTUL: () => handleButtonClick("listul", "- ", null, null, ""),
      LISTOL: () => handleButtonClick("listol", "1. ", null, null, ""),
      CHECKLIST: () => handleButtonClick("checklist", "- [ ]", null, null, ""),
      ACTIVITY: () =>
        handleButtonClick("activity", "{.activity}\n\n", null, null, ""),
      INTRO: () => handleButtonClick("intro", "{.intro}\n\n", null, null, ""),
      INLINE: () => handleButtonClick("inline", "``", 1, 1, ""),
      CODEBLOCK: () =>
        handleButtonClick("codeblock", `${temp}\n\n${temp}`, 4, 4, "\n")
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
