import React, { useState, useEffect } from "react";
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
  activity: true,
  intro: true,
  inline: true,
  codeblock: true
};

var charCounter = 0;

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

  const onKeyPress = e => {
    if (e.charCode === 9) {
      handleChange(inputTextfromTextArea.concat("     "));
    }
  };

  // TODO: Rydde opp eller Refactorere handleButtonClick. Er mye rot her nå.

  const handleButtonClick = (
    value,
    cursorIntON,
    cursorIntOFF,
    bTitle,
    endOutput
  ) => {
    // flytte fokus til tekstvindu etter button-click
    editorRef.current.focus();

    // Knapper for lagring av tekst. UndoRedo, etc

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
      inputTextfromTextArea = undo[undo.length - 1];
      setTextValue(inputTextfromTextArea);
      setMdValue(mdParser(undo[undo.length - 1]));
      setRedo([...redo, undo[undo.length - 1]]);
      setUndo(undo.slice(0, -1));
    }

    if (bTitle === "redo") {
      if (redo.length <= 0) {
        return;
      }
      inputTextfromTextArea = redo[redo.length - 1];
      setTextValue(inputTextfromTextArea);
      setMdValue(mdParser(redo[redo.length - 1]));
      setUndo([...undo, redo[redo.length - 1]]);
      setRedo(redo.slice(0, -1));
    }

    // sjekker om knapp er feks et Steg (all styling som begyner med "{" ).

    if (value[0] === "{") {
      let i = value + endOutput;
      inputTextfromTextArea = inputTextfromTextArea.concat(i);
      setTextValue(inputTextfromTextArea);
      return;
    }

    if (value === "## ") {
      if (
        inputTextfromTextArea.substring(inputTextfromTextArea.length - 3) ===
        "## "
      ) {
        inputTextfromTextArea = inputTextfromTextArea.substr(
          0,
          inputTextfromTextArea.length - 3
        );
        inputTextfromTextArea = inputTextfromTextArea.concat("# ");
        setTextValue(inputTextfromTextArea);
        return;
      }
    }

    //  Konfig av knapper slik at de registrerer om de er tryket, og flytter tekst-markøren i henhold til MD-syntax
    // Konfig-data finnes i egne config-filer.
    // if/else if kun hvis knapp er ment å skru av og på
    // hopp rett til "else" hvis knapp ikke har bool-verdi

    if (buttonBoolValues[bTitle] === true) {
      buttonBoolValues[bTitle] = false;
      inputTextfromTextArea = inputTextfromTextArea.concat(value);
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
      inputTextfromTextArea = inputTextfromTextArea.concat(value);
      setTextValue(inputTextfromTextArea);
    }
  };

  const mySubmitHandler = event => {
    event.preventDefault();

    // TODO: Send inputtext-data to database
  };

  return (
    <div>
      <div className="controlPanelPlacement">
        <ControlPanel handleButtonClick={handleButtonClick} />
        <Autosave
          autoSave={autoSave}
          counter={counter}
          setCounter={setCounter}
        />
        <div className="ui two column test grid">
          <div className="column">
            <MDTextArea
              editorRef={editorRef}
              textValue={inputTextfromTextArea}
              onInputChange={handleChange}
              handleButtonClick={handleButtonClick}
              onKeyPress={onKeyPress}
            />
          </div>
          <div className="column">
            <MDPreview mdValue={mdValue} />
          </div>
        </div>
      </div>
      <div className="editorFormbuttons">
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
