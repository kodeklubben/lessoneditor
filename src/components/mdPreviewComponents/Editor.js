import React, { useState, useEffect } from "react";
import "../../index.css";
import MDTextArea from "./MDTextArea";
import MDPreview from "./MDPreview";
import { mdParser } from "../../utils/mdParser";
import ControlPanel from "./ControlPanel";

var buttonBoolValues = {
  bold: true,
  italic: true,
  activity: true,
  intro: true,
  inline: true,
  codeblock: true
};

// undo/redo stacks variables

var undoStack = [];
var redoStack = [];

var inputTextfromTextArea = "";

// ___________________

const Editor = () => {
  const [counter, setCounter] = useState(10);
  const [textValue, setTextValue] = useState("");
  const [mdValue, setMdValue] = useState("");
  const [boolButton, setBoolButton] = useState(buttonBoolValues);
  const [storedTextValue, setStoredTextValue] = useState("");

  // referanseVariabel for Textarea-elementet i DOM.  Tillater å manipulere DOM i react

  const editorRef = React.useRef();

  // useEffect()  Koden kjører når komponenten "mounts"
  useEffect(() => {
    counter >= 0 &&
      setTimeout(() => {
        setCounter(counter - 1);
      }, 1000);
  });

  const handleChange = textInput => {
    inputTextfromTextArea = textInput;

    if (
      inputTextfromTextArea.charCodeAt(inputTextfromTextArea.length - 1) === 32
    ) {
      undoStack.push(inputTextfromTextArea);
    }
    setTextValue(inputTextfromTextArea);
    setMdValue(mdParser(inputTextfromTextArea));
  };

  //TODO: Rydde opp eller Refactorere handleButtonClick. Er mye rot her nå.

  const handleButtonClick = (
    value,
    cursorIntON,
    cursorIntOFF,
    bTitle,
    endOutput
  ) => {
    let temp = textValue;
    editorRef.current.focus();

    // Knapper for lagring av tekst.

    if (bTitle === "load") {
      setTextValue(storedTextValue);
      setMdValue(mdParser(storedTextValue));
      return;
    }

    if (bTitle === "save") {
      setStoredTextValue(inputTextfromTextArea);
      return;
    }

    if (bTitle === "undo") {
      let tempUndo = undoStack[undoStack.length - 1];
      setTextValue(tempUndo);
      if (undoStack.length <= 0) {
        setTextValue("");
        return;
      }
      undoStack.pop();

      redoStack.push(tempUndo);
    }

    if (bTitle === "redo") {
      let tempRedo = redoStack[redoStack.length - 1];
      setTextValue(tempRedo);
      if (redoStack.length <= 0) {
        return;
      }
      redoStack.pop();

      undoStack.push(tempRedo);
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
        <p>{counter < 4 && counter >= 0 ? "saving" : ""}</p>
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
