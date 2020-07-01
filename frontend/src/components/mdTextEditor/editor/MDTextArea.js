import React from "react";
import { GlobalHotKeys, configure } from "react-hotkeys";

import {
  KEY_COMBINATIONS as KEY,
  emphasis,
  undoRedo,
  saveLoadNew,
  image,
  lists,
  sections,
  code,
} from "../settingsFiles/buttonConfig";

// konfigurerer HotKeys-React
configure({
  ignoreTags: [],
});

// Make keyboard shortcuts with React Hotkeys
// config in ./settingsFiles/buttonConfig.js
const keyMap = {
  PREVIEW: KEY.preview.join(""),
  BOLD: KEY.bold.join(""),
  ITALIC: KEY.italic.join(""),
  HEADING: KEY.heading.join(""),
  STRIKETHROUGH: KEY.strikethrough.join(""),
  UNDO: KEY.undo.join(""),
  REDO: KEY.redo.join(""),
  NEW: KEY.new.join(""),
  LOAD: KEY.load.join(""),
  SAVE: KEY.save.join(""),
  IMAGE: KEY.image.join(""),
  LISTUL: KEY.listul.join(""),
  LISTOL: KEY.listol.join(""),
  CHECKLIST: KEY.listcheck.join(""),
  ACTIVITY: KEY.activity.join(""),
  INTRO: KEY.intro.join(""),
  CHECK: KEY.check.join(""),
  TIP: KEY.tip.join(""),
  PROTIP: KEY.protip.join(""),
  CHALLENGE: KEY.challenge.join(""),
  FLAG: KEY.flag.join(""),
  TRY: KEY.try.join(""),
  INLINE: KEY.inline.join(""),
  CODEBLOCK: KEY.codeblock.join(""),
};

// keyboard shortcut actions.  Settings in ./settingsFiles/buttonConfig.js
// needs to be updated manually with same parameters as buttonConfig
// SORRY FOR WET CODE AND MANUAL UPDATE. NEED HELP FIXING

const MDTextArea = (props) => {
  const handlers = {
    // preview button
    PREVIEW: () => props.handlePreview(true),

    // emphasis
    BOLD: () =>
      props.handleButtonClick(
        emphasis[0].bTitle,
        emphasis[0].output,
        emphasis[0].cursorIntON,
        emphasis[0].cursorIntOFF,
        emphasis[0].endOutput
      ),
    ITALIC: () =>
      props.handleButtonClick(
        emphasis[1].bTitle,
        emphasis[1].output,
        emphasis[1].cursorIntON,
        emphasis[1].cursorIntOFF,
        emphasis[1].endOutput
      ),
    HEADING: () =>
      props.handleButtonClick(
        emphasis[2].bTitle,
        emphasis[2].output,
        emphasis[2].cursorIntON,
        emphasis[2].cursorIntOFF,
        emphasis[2].endOutput
      ),
    STRIKETHROUGH: () =>
      props.handleButtonClick(
        emphasis[3].bTitle,
        emphasis[3].output,
        emphasis[3].cursorIntON,
        emphasis[3].cursorIntOFF,
        emphasis[3].endOutput
      ),

    //undoRedo
    UNDO: () =>
      props.handleButtonClick(
        undoRedo[0].bTitle,
        undoRedo[0].output,
        undoRedo[0].cursorIntON,
        undoRedo[0].cursorIntOFF,
        undoRedo[0].endOutput
      ),
    REDO: () =>
      props.handleButtonClick(
        undoRedo[1].bTitle,
        undoRedo[1].output,
        undoRedo[1].cursorIntON,
        undoRedo[1].cursorIntOFF,
        undoRedo[1].endOutput
      ),

    //saveLoadNew
    NEW: () =>
      props.handleButtonClick(
        saveLoadNew[0].bTitle,
        saveLoadNew[0].output,
        saveLoadNew[0].cursorIntON,
        saveLoadNew[0].cursorIntOFF,
        saveLoadNew[0].endOutput
      ),
    LOAD: () =>
      props.handleButtonClick(
        saveLoadNew[1].bTitle,
        saveLoadNew[1].output,
        saveLoadNew[1].cursorIntON,
        saveLoadNew[1].cursorIntOFF,
        saveLoadNew[1].endOutput
      ),
    SAVE: () =>
      props.handleButtonClick(
        saveLoadNew[2].bTitle,
        saveLoadNew[2].output,
        saveLoadNew[2].cursorIntON,
        saveLoadNew[2].cursorIntOFF,
        saveLoadNew[2].endOutput
      ),

    //image
    IMAGE: () =>
      props.handleButtonClick(
        image[0].bTitle,
        image[0].output,
        image[0].cursorIntON,
        image[0].cursorIntOFF,
        image[0].endOutput
      ),

    //lists
    LISTUL: () =>
      props.handleButtonClick(
        lists[0].bTitle,
        lists[0].output,
        lists[0].cursorIntON,
        lists[0].cursorIntOFF,
        lists[0].endOutput
      ),
    LISTOL: () =>
      props.handleButtonClick(
        lists[1].bTitle,
        lists[1].output,
        lists[1].cursorIntON,
        lists[1].cursorIntOFF,
        lists[1].endOutput
      ),
    CHECKLIST: () =>
      props.handleButtonClick(
        lists[2].bTitle,
        lists[2].output,
        lists[2].cursorIntON,
        lists[2].cursorIntOFF,
        lists[2].endOutput
      ),

    //sections
    ACTIVITY: () =>
      props.handleButtonClick(
        sections[0].bTitle,
        sections[0].output,
        sections[0].cursorIntON,
        sections[0].cursorIntOFF,
        sections[0].endOutput
      ),
    INTRO: () =>
      props.handleButtonClick(
        sections[1].bTitle,
        sections[1].output,
        sections[1].cursorIntON,
        sections[1].cursorIntOFF,
        sections[1].endOutput
      ),
    CHECK: () =>
      props.handleButtonClick(
        sections[2].bTitle,
        sections[2].output,
        sections[2].cursorIntON,
        sections[2].cursorIntOFF,
        sections[2].endOutput
      ),
    TIP: () =>
      props.handleButtonClick(
        sections[3].bTitle,
        sections[3].output,
        sections[3].cursorIntON,
        sections[3].cursorIntOFF,
        sections[3].endOutput
      ),
    PROTIP: () =>
      props.handleButtonClick(
        sections[4].bTitle,
        sections[4].output,
        sections[4].cursorIntON,
        sections[4].cursorIntOFF,
        sections[4].endOutput
      ),
    CHALLENGE: () =>
      props.handleButtonClick(
        sections[5].bTitle,
        sections[5].output,
        sections[5].cursorIntON,
        sections[5].cursorIntOFF,
        sections[5].endOutput
      ),
    FLAG: () =>
      props.handleButtonClick(
        sections[6].bTitle,
        sections[6].output,
        sections[6].cursorIntON,
        sections[6].cursorIntOFF,
        sections[6].endOutput
      ),
    TRY: () =>
      props.handleButtonClick(
        sections[7].bTitle,
        sections[7].output,
        sections[7].cursorIntON,
        sections[7].cursorIntOFF,
        sections[7].endOutput
      ),

    //code
    INLINE: () =>
      props.handleButtonClick(
        code[0].bTitle,
        code[0].output,
        code[0].cursorIntON,
        code[0].cursorIntOFF,
        code[0].endOutput
      ),
    CODEBLOCK: () =>
      props.handleButtonClick(
        code[1].bTitle,
        code[1].output,
        code[1].cursorIntON,
        code[1].cursorIntOFF,
        code[1].endOutput
      ),
  };
  return (
    <GlobalHotKeys id="hotkeysID" handlers={handlers} keyMap={keyMap}>
      <textarea
        autoFocus
        ref={props.editorRef}
        className="TextArea"
        value={props.mdText}
        onChange={(event) => props.onInputChange(event)}
        onKeyDown={(event) => props.onTextareaKeyDown(event)}
        onKeyUp={(event) => props.onTextareaKeyUp(event)}
        onMouseDown={(event) => props.onTextareaMouseDown(event)}
        onTouchEnd={(event) => props.onTextareaMouseDown(event)}
        onSelect={(event) => props.onTextareaSelect(event)}
        onWheel={(event) => props.onTextareaMouseDown(event)}
      />
    </GlobalHotKeys>
  );
};

export default MDTextArea;
