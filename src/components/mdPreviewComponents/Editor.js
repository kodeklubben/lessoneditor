import React, { useState } from "react";
import "../../index.css";
import MDTextArea from "./MDTextArea";
import MDPreview from "./MDPreview";
import { mdParser } from "../../utils/mdParser";
import ControlPanel from "./ControlPanel";
import PageButtons from "../PageButtons";
import { GlobalHotKeys, configure } from "react-hotkeys";
import Autosave from "./Autosave";
// import { Redirect } from "react-router-dom";

// variabler som sjekker om en knapp er trykket ned:
var buttonBoolValues = {
  bold: true,
  italic: true,
  activity: true,
  intro: true,
  inline: true,
  codeblock: true,
  heading: true,
  heading2: true
};

const temp = "```";

var charCounter = 0;

var OSspecificKey = "ctrl+";

// egen variabel for input i textarea utfor state. Viste seg å være nødvendig for undo/redo-funksjon pga måten textarea oppdateres fra state.
var inputTextfromTextArea = "";

// ___________________

const Editor = () => {
  const [counter, setCounter] = useState(20); //  <<<<--   init autosave length in seconds here.
  const [undo, setUndo] = useState([""]);
  const [redo, setRedo] = useState([]);
  const [textValue, setTextValue] = useState("");
  const [mdValue, setMdValue] = useState("");
  const [boolButton, setBoolButton] = useState(buttonBoolValues);
  const [storedTextValue, setStoredTextValue] = useState("");

  // referanseVariabel for Textarea-elementet i DOM.  Tillater å manipulere DOM i react

  const editorRef = React.useRef();

  const autoSave = () => {
    setStoredTextValue(inputTextfromTextArea);
  };

  const handleChange = textInput => {
    // lagrer inputtekst utfor state.  Pga undo/redo.  State kontroll :P
    inputTextfromTextArea = textInput;

    // hvis tekstinput er mellomrom lagres textinput til undo:
    if (
      textInput.charCodeAt(textInput.length - 1) === 32 ||
      textInput.charCodeAt(textInput.length - 1) === 10
    ) {
      setUndo([...undo, inputTextfromTextArea]);
    }

    // Teller bokstaver på input, og tvinger linjeskift hvis det er 80 bokstaver
    charCounter += 1;

    if (textInput.charCodeAt(textInput.length - 1) === 10) {
      charCounter = 0;
    }

    if (charCounter === 80) {
      inputTextfromTextArea += "\n";
      charCounter = 0;
    }

    // textinput output til editor:
    setTextValue(inputTextfromTextArea);
    setMdValue(mdParser(inputTextfromTextArea));
  };
  // _______________________________________________________________________

  const onTextareaKeyDown = e => {
    console.log(e);
    console.log(e.keyCode);

    if (e.ctrlKey && e.keyCode === 66) {
      e.preventDefault();
    }

    if (e.ctrlKey && e.keyCode === 67) {
      e.preventDefault();
    }

    if (e.ctrlKey && e.keyCode === 72) {
      e.preventDefault();
    }

    if (e.ctrlKey && e.keyCode === 82) {
      e.preventDefault();
    }
    if (e.ctrlKey && e.keyCode === 84) {
      e.preventDefault();
    }
    if (e.ctrlKey && e.keyCode === 90) {
      e.preventDefault();
    }
    if (e.keyCode === 9) {
      e.preventDefault();
      inputTextfromTextArea = inputTextfromTextArea.concat("  ");
    }
  };

  // TODO: Rydde opp eller Refactorere handleButtonClick. Er mye rot her nå.
  const handleButtonClick = (
    output,
    cursorIntON,
    cursorIntOFF,
    bTitle,
    endOutput
  ) => {
    // flytte fokus til tekstvindu etter button-click
    editorRef.current.focus();

    // nuller ut verdi fra knapp-trykk om verdien allerede er lagt til tekst.
    // kanselerer da ut knappetrykket.
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

    // fjerner all tekst i editor og lagring.
    if (bTitle === "new") {
      inputTextfromTextArea = "";
      setUndo(inputTextfromTextArea);
      setRedo(inputTextfromTextArea);
      setTextValue(inputTextfromTextArea);
      setMdValue(mdParser(inputTextfromTextArea));
      return;
    }

    // Load, save, undo, redo funksjoner

    if (bTitle === "load") {
      inputTextfromTextArea = storedTextValue;
      setUndo([inputTextfromTextArea]);
      setTextValue(inputTextfromTextArea);
      setMdValue(mdParser(inputTextfromTextArea));
      return;
    }

    if (bTitle === "save") {
      setStoredTextValue(inputTextfromTextArea);
      return;
    }

    if (bTitle === "undo") {
      if (undo.length <= 0) {
        return;
      }
      setRedo([...redo, inputTextfromTextArea]);
      inputTextfromTextArea = undo.pop();
      setTextValue(inputTextfromTextArea);
      setMdValue(mdParser(inputTextfromTextArea));
      return;
      //setUndo(undo.slice(0, -1));
    }

    if (bTitle === "redo") {
      if (redo.length <= 0) {
        return;
      }
      setUndo([...undo, inputTextfromTextArea]);
      inputTextfromTextArea = redo[redo.length - 1];
      setTextValue(inputTextfromTextArea);
      setMdValue(mdParser(inputTextfromTextArea));

      setRedo(redo.slice(0, -1));
      return;
    }

    // sjekker om knapp er feks et Steg (all styling som begyner med "{" ).
    // if (bTitle === "activity" || bTitle === "intro") {
    //   output = output + endOutput;
    //   handleButtonClick(output, 0, 0, "", "");
    //   return;
    //   // inputTextfromTextArea = inputTextfromTextArea.concat(output);
    //   // setTextValue(inputTextfromTextArea);
    // }

    // Config for å gi "heading" flere verdier på en knapp
    if (
      output === "## " &&
      inputTextfromTextArea.substring(inputTextfromTextArea.length - 3) ===
        "## " &&
      buttonBoolValues["heading"]
    ) {
      buttonBoolValues["heading"] = false;
      inputTextfromTextArea = inputTextfromTextArea.substr(
        0,
        inputTextfromTextArea.length - 3
      );
      inputTextfromTextArea += "# ";
      setTextValue(inputTextfromTextArea);
      return;
    } else if (output === "## " && buttonBoolValues["heading"]) {
      inputTextfromTextArea += output;
      setTextValue(inputTextfromTextArea);
      return;
    } else if (output === "## " && !buttonBoolValues["heading"]) {
      if (
        inputTextfromTextArea.substring(inputTextfromTextArea.length - 2) ===
        "# "
      ) {
        inputTextfromTextArea = inputTextfromTextArea.substring(
          0,
          inputTextfromTextArea.length - 2
        );
        buttonBoolValues["heading"] = true;
        setTextValue(inputTextfromTextArea);
        return;
      }
    }

    //  Konfig av knapper slik at de registrerer om de er tryket, og flytter tekst-markøren i henhold til MD-syntax
    // Konfig-data finnes i ./buttonConfig.js
    // if/elseIf  kun hvis knapp er ment å skru av og på
    // hopp rett til "else" hvis knapp ikke har bool-verdi

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
    NEW: OSspecificKey + "n",
    LOAD: OSspecificKey + "l",
    SAVE: OSspecificKey + "s",
    IMAGE: OSspecificKey + "p",
    LISTUL: OSspecificKey + "u",
    LISTOL: OSspecificKey + "o",
    CHECKLIST: OSspecificKey + "t",
    ACTIVITY: OSspecificKey + "a",
    INTRO: OSspecificKey + "o",
    INLINE: OSspecificKey + "e",
    CODEBLOCK: OSspecificKey + "k"
  };

  const handlers = {
    BOLD: () => handleButtonClick("****", 2, 2, "bold", ""),
    ITALIC: () => handleButtonClick("__ ", 2, 2, "italic", ""),
    HEADING: () => handleButtonClick("## ", 2, 2, "heading", ""),
    UNDO: () => handleButtonClick("", null, null, "undo", ""),
    REDO: () => handleButtonClick("", null, null, "redo", ""),
    NEW: () => handleButtonClick("", null, null, "new", ""),
    LOAD: () => handleButtonClick("", null, null, "load", ""),
    SAVE: () => handleButtonClick("", null, null, "save", ""),
    IMAGE: () => handleButtonClick("", null, null, "image", ""),
    LISTUL: () => handleButtonClick("- ", null, null, "listul", ""),
    LISTOL: () => handleButtonClick("1. ", null, null, "listol", ""),
    CHECKLIST: () => handleButtonClick("- [ ]", null, null, "checklist", ""),
    ACTIVITY: () =>
      handleButtonClick("{.activity}\n\n", null, null, "activity", ""),
    INTRO: () => handleButtonClick("{.intro}\n\n", null, null, "intro", ""),
    INLINE: () => handleButtonClick("``", 1, 1, "inline", ""),
    CODEBLOCK: () =>
      handleButtonClick(`${temp}\n\n${temp}`, 4, 0, "codeblock", "")
  };

  // konfigurerer HotKeys-React
  configure({
    ignoreTags: []
  });

  return (
    <div className="">
      <div className="controlPanelPlacement">
        <ControlPanel handleButtonClick={handleButtonClick} />
        <Autosave
          autoSave={autoSave}
          counter={counter}
          setCounter={setCounter}
        />
        <div className="ui two column test grid">
          <div className="column">
            <GlobalHotKeys keyMap={keyMap} handlers={handlers} />
            <MDTextArea
              editorRef={editorRef}
              textValue={inputTextfromTextArea}
              onInputChange={handleChange}
              handleButtonClick={handleButtonClick}
              onTextareaKeyDown={onTextareaKeyDown}
            />
          </div>
          <div className="column">
            <MDPreview mdValue={mdValue} />
          </div>
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
};

export default Editor;
