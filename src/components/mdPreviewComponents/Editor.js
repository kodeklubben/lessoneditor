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

//Hjelpevariabel for å formatere string fra knapp.
const temp = "```";

// teller input-tegn for automatisk linjeksift etter 80 tegn
var charCounter = 0;

// Variabel for hurtigtast til React Hotkeys (tastesnarveier)
var OSspecificKey = "ctrl+";

// egen variabel for input i textarea utfor state. Viste seg å være nødvendig for undo/redo-funksjon pga måten textarea oppdateres fra state.
var inputTextfromTextArea = "";

var undo = [""];
var redo = [];

// ___________________

const Editor = () => {
  const [counter, setCounter] = useState(20); //  <<<<--   init autosave length in seconds here.
  const [textValue, setTextValue] = useState("");
  const [mdValue, setMdValue] = useState("");
  const [boolButton, setBoolButton] = useState(buttonBoolValues);
  const [storedTextValue, setStoredTextValue] = useState("");

  // referanseVariabel for Textarea-elementet i DOM.  Tillater å manipulere DOM i react
  const editorRef = React.useRef();

  // autoSave funksjon kalles fra Autosave-komponent
  const autoSave = () => {
    setStoredTextValue(inputTextfromTextArea);
  };

  // all config for å behandle tekst i textarea
  const handleChange = textInput => {
    // lagrer inputtekst utfor state.  Pga undo/redo.  State kontroll :P
    inputTextfromTextArea = textInput;

    // hvis tekstinput er mellomrom lagres textinput til undo:
    if (
      textInput.charCodeAt(textInput.length - 1) === 32 ||
      textInput.charCodeAt(textInput.length - 1) === 10
    ) {
      undo = [...undo, inputTextfromTextArea];
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

  const onTextareaKeyUp = e => {};

  const onTextareaKeyDown = e => {
    console.log(e);
    console.log(e.keyCode);

    // // 65 = "b"
    // if (e.ctrlKey && e.keyCode === 66) {
    //   e.preventDefault();
    // }

    // // 73 = "i"
    // if (e.metaKey && e.keyCode === 73) {
    //   e.preventDefault();
    // }

    // // 72 = "h"
    // if (e.altKey && e.keyCode === 72) {
    //   e.preventDefault();
    // }

    // // 188 = "z"
    // if (e.ctrlKey && e.keyCode === 188) {
    //   e.preventDefault();
    // }
    if (e.ctrlKey && e.shiftKey && e.keyCode === 188) {
      e.preventDefault();
    }

    // // 78 = "n"
    // if (e.ctrlKey && e.keyCode === 78) {
    //   e.preventDefault();
    // }

    // // 76 = "l"
    // if (e.ctrlKey && e.keyCode === 76) {
    //   e.preventDefault();
    // }

    // // 83 = "s"
    // if (e.ctrlKey && e.keyCode === 83) {
    //   e.preventDefault();
    // }

    // // 80 = "p"
    // if (e.ctrlKey && e.keyCode === 84) {
    //   e.preventDefault();
    // }

    // //
    // if (e.ctrlKey && e.keyCode === 90) {
    //   e.preventDefault();
    // }

    if (e.ctrlKey && e.key) {
      e.preventDefault();
    }

    if (e.keyCode === 9) {
      e.preventDefault();
      inputTextfromTextArea = inputTextfromTextArea.concat("  ");
    }
  };

  // TODO: Rydde opp eller Refactorere handleButtonClick. Er mye rot her nå.
  const handleButtonClick = (
    bTitle,
    output,
    cursorIntON,
    cursorIntOFF,
    endOutput
  ) => {
    // flytte fokus til tekstvindu etter button-click
    editorRef.current.focus();

    // fjerner all tekst i editor og lagring.
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
      setStoredTextValue(inputTextfromTextArea);
      return;
    }

    if (bTitle === "undo") {
      console.log("stack1: " + undo);
      if (undo.length <= 0) {
        return;
      }
      redo = [...redo, inputTextfromTextArea];
      inputTextfromTextArea = undo.pop();
      setTextValue(inputTextfromTextArea);
      setMdValue(mdParser(inputTextfromTextArea));

      console.log("stack2: " + undo);
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
      } else {
        return;
      }
    }

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
      editorRef.current.focus();
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
      editorRef.current.focus();
      return;
    } else {
      inputTextfromTextArea = inputTextfromTextArea.concat(output);
      setTextValue(inputTextfromTextArea);
      editorRef.current.focus();
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
    NEW: OSspecificKey + "n",
    LOAD: OSspecificKey + "l",
    SAVE: OSspecificKey + "s",
    IMAGE: OSspecificKey + "p",
    LISTUL: OSspecificKey + "u",
    LISTOL: OSspecificKey + "o",
    CHECKLIST: OSspecificKey + "t",
    ACTIVITY: OSspecificKey + "a",
    INTRO: OSspecificKey + "r",
    INLINE: OSspecificKey + "e",
    CODEBLOCK: OSspecificKey + "k"
  };

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
      handleButtonClick("codeblock", `${temp}\n\n${temp}`, 4, 0, "")
  };

  return (
    <div className="">
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
              onTextareaKeyUp={onTextareaKeyUp}
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
          autoSave={autoSave}
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