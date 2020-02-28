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

var storedTextValue = "";

// undo/redo stacks variables

var undoStack = [];
var redoStack = [];

// ___________________

const Editor = () => {
  const [textValue, setTextValue] = useState("");
  const [mdValue, setMdValue] = useState("");
  const [boolButton, setBoolButton] = useState(buttonBoolValues);

  const handleChange = textInput => {
    if (
      textInput.charCodeAt(textInput.length - 1) === 32 ||
      textInput.charCodeAt(textInput.length - 1) === 10
    ) {
      undoStack.push(textInput);
    }

    console.log("undostack: " + undoStack);

    setTextValue(textInput);
    setMdValue(mdParser(textInput));
  };

  // referanseVariabel for Textarea-elementet i DOM.  Tillater å manipulere DOM i react

  const editorRef = React.useRef();

  // useEffect()  Koden kjører når komponenten "mounts"
  // Her lagrer den Textvalue til storedTextValue hver 10. sekund.

  useEffect(() => {
    setTimeout(() => {
      storedTextValue = textValue;
    }, 10000);
  });

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

    if (bTitle === "undo") {
      if (undoStack.length <= 0) {
        setTextValue("");
        setMdValue(mdParser(""));
        return;
      }
      let tempUndo = undoStack.pop();
      setTextValue(tempUndo);
      setMdValue(mdParser(tempUndo));
      redoStack.push(tempUndo);
    }

    if (bTitle === "redo") {
      if (redoStack.length <= 0) {
        return;
      }
      let tempRedo = redoStack.pop();
      setTextValue(tempRedo);
      setMdValue(mdParser(tempRedo));
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
