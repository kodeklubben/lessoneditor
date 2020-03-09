import React, { useState } from "react";
import "../../index.css";
import MDTextArea from "./MDTextArea";
import MDPreview from "./MDPreview";
import { mdParser } from "../../utils/mdParser";
import ControlPanel from "./ControlPanel";
import PageButtons from "../PageButtons";
import Autosave from "./Autosave";
// import { Redirect } from "react-router-dom";

// variabler som sjekker om en knapp er trykket ned:
var buttonBoolValues = {
  bold: true,
  italic: true,
  heading: true,
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

// egen variabel for input i textarea. Lagres som egen variabel før den pushes til statevariabel "textValue".
// dette fordi den da kan manipuleres uten å re-rendre siden hele tiden.
var inputTextfromTextArea = "";

var storedTextValue = "";

// undo/redo - variabler.
var undo = [""];
var redo = [];

// autosave-lengde i sekunder, må være over 3 sek:
var autosaveLength = 30;

// ___________________

const Editor = () => {
  const [counter, setCounter] = useState(autosaveLength);
  const [textValue, setTextValue] = useState("");
  const [mdValue, setMdValue] = useState("");
  const [boolButton, setBoolButton] = useState(buttonBoolValues);

  //Hack-variabler for å fjerne kompileringsfeilmeldinger:
  var test1 = textValue;
  var test2 = boolButton;
  test1 = test2;
  test2 = test1;

  // referanseVariabel (type: GetDocumentByID i vanlig JS) for Textarea-elementet i DOM.  Tillater å manipulere DOM i react
  // brukes her til å flytte fokus fra knapp tilbake til textarea
  const editorRef = React.useRef();

  // autoSave funksjon kalles fra Autosave-komponent
  const autoSaveFn = () => {
    storedTextValue = inputTextfromTextArea;
  };

  // all config for å behandle tekst i textarea
  const handleChange = textInput => {
    // lagrer inputtekst utfor state.
    inputTextfromTextArea = textInput;

    // hvis tekstinput er mellomrom eller enter, lagres textinput til undo:
    if (
      textInput.charCodeAt(textInput.length - 1) === 32 ||
      textInput.charCodeAt(textInput.length - 1) === 10
    ) {
      undo = [...undo, inputTextfromTextArea];
    }

    // Teller input-tegn, og tvinger linjeskift hvis det passerer 80 tegn
    charCounter += 1;

    if (textInput.charCodeAt(textInput.length - 1) === 10) {
      charCounter = 0;
    }

    if (charCounter === 80) {
      inputTextfromTextArea += "\n";
      charCounter = 0;
    }

    // dytter tekstinput til state for å re-rendre siden.
    setTextValue(inputTextfromTextArea);
    setMdValue(mdParser(inputTextfromTextArea));
  };

  // konfigurering for å fjerne default-funksjoner av tastekombinasjoner
  // brukes for å sette egne hurtigtaster i teksteditor.
  const onTextareaKeyDown = e => {
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
      if (!boolButton["codeblock"]) {
        let i = inputTextfromTextArea.substring(
          0,
          inputTextfromTextArea.length - 4
        );
        inputTextfromTextArea = i + "  \n" + temp;
        setTextValue(inputTextfromTextArea);
        setTimeout(() => {
          editorRef.current.selectionStart -= 4;
          editorRef.current.selectionEnd -= 4;
        }, 0);

        return;
      }
      inputTextfromTextArea += "  ";
    }
  };

  const ifNewLine = () => {
    return inputTextfromTextArea[inputTextfromTextArea.length - 1] === "\n" ||
      inputTextfromTextArea === "" ||
      inputTextfromTextArea.substring(inputTextfromTextArea.length - 3) ===
        "## " ||
      inputTextfromTextArea.substring(inputTextfromTextArea.length - 2) === "# "
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
    editorRef.current.focus();

    // fjerner all tekst i editor og undo/redo-variablene
    if (bTitle === "new") {
      inputTextfromTextArea = "";
      undo = [""];
      redo = [];
      setTextValue(inputTextfromTextArea);
      setMdValue(mdParser(inputTextfromTextArea));
      return;
    }

    // Load, save, undo, redo funksjoner

    if (bTitle === "load") {
      inputTextfromTextArea = storedTextValue;
      undo = [inputTextfromTextArea];
      setTextValue(inputTextfromTextArea);
      setMdValue(mdParser(inputTextfromTextArea));
      return;
    }

    if (bTitle === "save") {
      storedTextValue = inputTextfromTextArea;
      return;
    }

    if (bTitle === "undo") {
      if (undo.length <= 0) {
        return;
      }
      redo = [...redo, inputTextfromTextArea];
      inputTextfromTextArea = undo.pop();
      setTextValue(inputTextfromTextArea);
      setMdValue(mdParser(inputTextfromTextArea));
      return;
    }

    if (bTitle === "redo") {
      if (redo.length <= 0) {
        return;
      }
      undo = [...undo, inputTextfromTextArea];
      inputTextfromTextArea = redo.pop();
      setTextValue(inputTextfromTextArea);
      setMdValue(mdParser(inputTextfromTextArea));
      return;
    }

    // Config for å gi "heading" flere verdier på en knapp

    if (ifNewLine()) {
      if (
        output === "## " &&
        inputTextfromTextArea.substring(inputTextfromTextArea.length - 3) ===
          output &&
        buttonBoolValues[bTitle]
      ) {
        buttonBoolValues[bTitle] = false;
        inputTextfromTextArea = inputTextfromTextArea.substr(
          0,
          inputTextfromTextArea.length - 3
        );
        inputTextfromTextArea += "# ";
        setTextValue(inputTextfromTextArea);
        return;
      } else if (output === "## " && buttonBoolValues[bTitle]) {
        inputTextfromTextArea += output;
        setTextValue(inputTextfromTextArea);
        return;
      } else if (output === "## " && !buttonBoolValues[bTitle]) {
        if (
          inputTextfromTextArea.substring(inputTextfromTextArea.length - 2) ===
          "# "
        ) {
          inputTextfromTextArea = inputTextfromTextArea.substring(
            0,
            inputTextfromTextArea.length - 2
          );
          buttonBoolValues[bTitle] = true;
          setTextValue(inputTextfromTextArea);
          return;
        } else {
          buttonBoolValues[bTitle] = true;
          return;
        }
      }
    }

    if (
      bTitle === "heading" ||
      (bTitle === "codeblock" && buttonBoolValues["codeblock"] && !ifNewLine())
    ) {
      return;
    }

    if (
      (bTitle === "activity" && ifNewLine()) ||
      (bTitle === "intro" && ifNewLine())
    ) {
      return;
    }

    // nuller ut verdi fra knapp-trykk om man trykker en gang til på knapp uten å ha skrevet noen tegn.
    // kanselerer da ut første knappetrykket.
    if (
      inputTextfromTextArea.substring(
        inputTextfromTextArea.length - output.length
      ) === output &&
      !buttonBoolValues[bTitle]
    ) {
      inputTextfromTextArea = inputTextfromTextArea.substring(
        0,
        inputTextfromTextArea.length - output.length
      );
      buttonBoolValues[bTitle] = true;
      setTextValue(inputTextfromTextArea);
      return;
    }

    //  Konfig av knapper slik at de registrerer om de er trykket, og flytter tekst-markøren i henhold til hvordan MD-syntax ser ut
    // Konfig-data finnes i ./buttonConfig.js der tallverdi for hvor mye tekst-markøren skal flyttes er definert in "cursorIntON" og "cursorIntOFF"

    if (buttonBoolValues[bTitle] === true) {
      buttonBoolValues[bTitle] = false;
      inputTextfromTextArea = inputTextfromTextArea.concat(output);
      setTextValue(inputTextfromTextArea);
      setTimeout(() => {
        editorRef.current.selectionStart -= cursorIntON;
        editorRef.current.selectionEnd -= cursorIntON;
      }, 0);
      setBoolButton(buttonBoolValues);
      return;
    } else if (buttonBoolValues[bTitle] === false) {
      buttonBoolValues[bTitle] = true;
      setTimeout(() => {
        editorRef.current.selectionStart += cursorIntOFF;
        editorRef.current.selectionEnd += cursorIntOFF;
        if (endOutput) {
          inputTextfromTextArea = inputTextfromTextArea.concat(endOutput);
          setTextValue(inputTextfromTextArea);
        }
      }, 0);
      setBoolButton(buttonBoolValues);
      return;
    } else {
      inputTextfromTextArea = inputTextfromTextArea.concat(output);
      setTextValue(inputTextfromTextArea);
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
              editorRef={editorRef}
              textValue={inputTextfromTextArea}
              onInputChange={handleChange}
              handleButtonClick={handleButtonClick}
              onTextareaKeyDown={onTextareaKeyDown}
              handlers={handlers}
              keyMap={keyMap}
            />
          </div>
          <div className="column">
            <MDPreview mdValue={mdValue} />
          </div>
        </div>
      </div>
      <div className="ui autosave container">
        <Autosave
          autoSaveFn={autoSaveFn}
          autosaveLength={autosaveLength}
          counter={counter}
          setCounter={setCounter}
        />
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
};

export default Editor;
