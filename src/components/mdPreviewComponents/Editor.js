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

const Editor = () => {
  const [textValue, setTextValue] = useState("");
  const [mdValue, setMdValue] = useState("");
  const [boolButton, setBoolButton] = useState(buttonBoolValues);

  const handleChange = textInput => {
    setTextValue(textInput);
    setMdValue(mdParser(textInput));
  };

  const editorRef = React.useRef();

  // useEffect()  Koden kjører når komponenten "mounts"
  // Her lagrer den Textvalue til storedTextValue hver 10. sekund.

  useEffect(() => {
    setTimeout(() => {
      storedTextValue = textValue;
    }, 10000);
  });

  //TODO: Rydde opp/Refactorere handleButtonClick

  const handleButtonClick = (
    value,
    cursorIntON,
    cursorIntOFF,
    bTitle,
    endOutput
  ) => {
    let temp = textValue;
    editorRef.current.focus();

    //if(bTitle === "load")    Henter verdiene som er autolagret.

    if (bTitle === "load") {
      setTextValue(storedTextValue);
      setMdValue(mdParser(storedTextValue));
      return;
    }

    if (value[0] === "{") {
      let i = value + endOutput;
      setTextValue(temp.concat(i));
      return;
    }
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
