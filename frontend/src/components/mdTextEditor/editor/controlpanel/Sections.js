import React from "react";
import CPButton from "./CPButton";

import { insertSection, cancelButton } from "./utils/buttonMethods";
import { sections as config } from "../../settingsFiles/buttonConfig";
import { SECTION_TEXT } from "components/mdTextEditor/settingsFiles/languages/editor_NO";

const Sections = ({
  editorRef,
  cursorPositionStart,
  cursorPositionEnd,
  mdText,
  buttonValues,
  setMdText,
  setCursorPosition,
  setCursor,
  setButtonValues,
}) => {
  const setChanges = (mdText, cursorPositionStart, cursorPositionEnd) => {
    setCursor(cursorPositionStart, cursorPositionEnd);
    setCursorPosition(cursorPositionStart, cursorPositionEnd);
    setMdText(mdText);
  };

  let results;

  const newHandleButtonClick = (button) => {
    editorRef.current.focus();
    setButtonValues((prevState) => ({
      ...prevState,
      [button]: !buttonValues[button],
    }));
    switch (button) {
      case "sec_activity":
        results = insertSection(
          buttonValues[button],
          button,
          mdText,
          "# " + SECTION_TEXT + " {.activity}\n",
          cursorPositionStart,
          cursorPositionEnd,
          0,
          13,
          SECTION_TEXT
        );
        setChanges(
          results.inputText,
          results.cursorPositionStart,
          results.cursorPositionEnd
        );
        break;
      case "sec_intro":
        results = insertSection(
          buttonValues[button],
          button,
          mdText,
          "# " + SECTION_TEXT + " {.intro}\n",
          cursorPositionStart,
          cursorPositionEnd,
          0,
          10,
          SECTION_TEXT
        );
        setChanges(
          results.inputText,
          results.cursorPositionStart,
          results.cursorPositionEnd
        );
        break;
      case "sec_check":
        results = insertSection(
          buttonValues[button],
          button,
          mdText,
          "## " + SECTION_TEXT + " {.check}\n",
          cursorPositionStart,
          cursorPositionEnd,
          0,
          10,
          SECTION_TEXT
        );
        setChanges(
          results.inputText,
          results.cursorPositionStart,
          results.cursorPositionEnd
        );
        break;
      case "sec_tip":
        results = insertSection(
          buttonValues[button],
          button,
          mdText,
          "## {.tip}\n" + SECTION_TEXT,
          cursorPositionStart,
          cursorPositionEnd,
          10,
          10,
          SECTION_TEXT
        );
        setChanges(
          results.inputText,
          results.cursorPositionStart,
          results.cursorPositionEnd
        );
        break;
      case "sec_protip":
        results = insertSection(
          buttonValues[button],
          button,
          mdText,
          "## " + SECTION_TEXT + " {.protip}\n",
          cursorPositionStart,
          cursorPositionEnd,
          0,
          11,
          SECTION_TEXT
        );
        setChanges(
          results.inputText,
          results.cursorPositionStart,
          results.cursorPositionEnd
        );
        break;
      case "sec_challenge":
        results = insertSection(
          buttonValues[button],
          button,
          mdText,
          "## " + SECTION_TEXT + " {.challenge}\n",
          cursorPositionStart,
          cursorPositionEnd,
          0,
          14,
          SECTION_TEXT
        );
        setChanges(
          results.inputText,
          results.cursorPositionStart,
          results.cursorPositionEnd
        );
        break;
      case "sec_flag":
        results = insertSection(
          buttonValues[button],
          button,
          mdText,
          "## " + SECTION_TEXT + " {.flag}\n",
          cursorPositionStart,
          cursorPositionEnd,
          0,
          9,
          SECTION_TEXT
        );
        setChanges(
          results.inputText,
          results.cursorPositionStart,
          results.cursorPositionEnd
        );
        break;
      case "sec_try":
        results = insertSection(
          buttonValues[button],
          button,
          mdText,
          "# " + SECTION_TEXT + " {.try}\n",
          cursorPositionStart,
          cursorPositionEnd,
          0,
          8,
          SECTION_TEXT
        );
        setChanges(
          results.inputText,
          results.cursorPositionStart,
          results.cursorPositionEnd
        );
        break;
      default:
        break;
    }
  };
  return (
    <>
      <div className="ui icon buttons emphasis">
        {config.map((element, index) => (
          <CPButton
            key={"element" + index}
            buttonTitle={element.buttonTitle}
            icon={element.icon}
            title={element.title}
            onButtonClick={newHandleButtonClick}
            shortcutKey={element.shortcut}
          />
        ))}
      </div>
    </>
  );
};

export default Sections;
