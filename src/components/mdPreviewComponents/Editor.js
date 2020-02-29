import React, { useState, useEffect } from "react";
import "../../index.css";
import MDTextArea from "./MDTextArea";
import MDPreview from "./MDPreview";
import { mdParser } from "../../utils/mdParser";
import ControlPanel from "./ControlPanel";
import { Redirect } from "react-router-dom";

// variabler som sjekker om en knapp er trykket ned:
var buttonBoolValues = {
  bold: true,
  italic: true,
  activity: true,
  intro: true,
  inline: true,
  codeblock: true
};

// egen variabel for input i textarea utfor state. Kanskje kjekk å ha...
var inputTextfromTextArea = "";

// meldingen i autosave
var autoSaveMessage = "";

// autosave-lengde i sekunder, må være over 3 sek:
const autoSaveLength = 20;

// ___________________

const Editor = () => {
  const [counter, setCounter] = useState(autoSaveLength);
  const [undo, setUndo] = useState([]);
  const [redo, setRedo] = useState([]);
  const [textValue, setTextValue] = useState("");
  const [mdValue, setMdValue] = useState("");
  const [boolButton, setBoolButton] = useState(buttonBoolValues);
  const [storedTextValue, setStoredTextValue] = useState("");

  // referanseVariabel for Textarea-elementet i DOM.  Tillater å manipulere DOM i react

  const editorRef = React.useRef();

  // useEffect():  Koden kjører når komponenten oppdaterer, passer bra til å konfigurere nedtelling:

  useEffect(() => {
    counter >= 0 &&
      setTimeout(() => {
        setCounter(counter - 1);
        if (counter === 3) {
          autoSaveMessage = "autosaving document...";
          setStoredTextValue(inputTextfromTextArea);
        }
        if (counter === 0) {
          setCounter(autoSaveLength);
          autoSaveMessage = " ";
        }
      }, 1000);
  });

  const handleChange = textInput => {
    // lagrer inputtekst utfor state.  Vet ikke hva jeg skal bruke det til da..  State kontroll :P
    inputTextfromTextArea = textInput;

    // hvis tekstinput er mellomrom lagres textinput til undo:
    if (textInput[textInput.length - 1] === " ") {
      setUndo([...undo, inputTextfromTextArea]);
    }

    // textinput output til editor:
    setTextValue(inputTextfromTextArea);
    setMdValue(mdParser(inputTextfromTextArea));
  };

  // TODO: Rydde opp eller Refactorere handleButtonClick. Er mye rot her nå.

  const handleButtonClick = (
    value,
    cursorIntON,
    cursorIntOFF,
    bTitle,
    endOutput
  ) => {
    let temp = textValue;
    editorRef.current.focus();

    // Knapper for lagring av tekst. UndoRedo, etc

    if (bTitle === "load") {
      setTextValue(storedTextValue);
      setMdValue(mdParser(storedTextValue));
      setUndo([]);
      setRedo([]);
      return;
    }

    if (bTitle === "save") {
      setStoredTextValue(inputTextfromTextArea);
      return;
    }

    if (bTitle === "undo") {
      if (undo.length <= 0) {
        setTextValue("");
        return;
      }
      setTextValue(undo[undo.length - 1]);
      setRedo([...redo, undo[undo.length - 1]]);
      setUndo(undo.slice(0, -1));
    }

    if (bTitle === "redo") {
      if (redo.length <= 0) {
        return;
      }
      setTextValue(redo[redo.length - 1]);
      setUndo([...undo, redo[redo.length - 1]]);
      setRedo(redo.slice(0, -1));
    }

    // sjekker om knapp er feks et Steg.

    if (value[0] === "{") {
      let i = value + endOutput;
      setTextValue(temp.concat(i));
      return;
    }

    //  Generelle knapper for styling av tekst

    if (buttonBoolValues[bTitle] === true) {
      buttonBoolValues[bTitle] = false;
      setTextValue(temp.concat(value));
      setTimeout(() => {
        editorRef.current.selectionStart -= cursorIntON;
        editorRef.current.selectionEnd -= cursorIntON;
      }, 0);
      setBoolButton(buttonBoolValues);
    } else {
      buttonBoolValues[bTitle] = true;
      setTimeout(() => {
        editorRef.current.selectionStart += cursorIntOFF;
        editorRef.current.selectionEnd += cursorIntOFF;
        if (endOutput) {
          setTextValue(temp.concat(endOutput));
        }
      }, 0);
      setBoolButton(buttonBoolValues);
    }
  };

  return (
    <div className="controlPanelPlacement">
      <ControlPanel handleButtonClick={handleButtonClick} />
      <div>
        <p>{autoSaveMessage}</p>
      </div>
      <div className="ui two column test grid">
        <div className="column">
          <MDTextArea
            editorRef={editorRef}
            textValue={textValue}
            onInputChange={handleChange}
            handleButtonClick={handleButtonClick}
          />
        </div>
        <div className="column">
          <MDPreview mdValue={mdValue} />
        </div>
      </div>
    </div>
  );
};

export default Editor;
