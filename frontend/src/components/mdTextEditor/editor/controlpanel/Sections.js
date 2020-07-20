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
  let cancelResults;

  const setSection = (button, cursorIntON, cursorIntOFF, output, cancelInt) => {
    cancelResults = cancelButton(
      buttonValues[button],
      mdText,
      cursorPositionStart,
      cursorPositionEnd,
      cancelInt,
      output
    );
    if (cancelResults.cancel) {
      setChanges(
        cancelResults.mdText,
        cancelResults.cursorPositionStart,
        cancelResults.cursorPositionEnd
      );
      return;
    }
    results = insertSection(
      buttonValues[button],
      button,
      mdText,
      output,
      cursorPositionStart,
      cursorPositionEnd,
      cursorIntON,
      cursorIntOFF,
      SECTION_TEXT
    );

    setChanges(
      results.inputText,
      results.cursorPositionStart,
      results.cursorPositionEnd
    );
  };

  const newHandleButtonClick = (button) => {
    editorRef.current.focus();
    setButtonValues((prevState) => ({
      ...prevState,
      [button]: !buttonValues[button],
    }));
    switch (button) {
      case "sec_activity":
        setSection(button, 0, 13, "# " + SECTION_TEXT + " {.activity}\n", 2);
        break;
      case "sec_intro":
        setSection(button, 0, 10, "# " + SECTION_TEXT + " {.intro}\n", 2);
        break;
      case "sec_check":
        setSection(button, 0, 10, "## " + SECTION_TEXT + " {.check}\n", 3);
        break;
      case "sec_tip":
        setSection(button, 10, 10, "## {.tip}\n" + SECTION_TEXT, 10);
        break;
      case "sec_protip":
        setSection(button, 0, 11, "## " + SECTION_TEXT + " {.protip}\n", 3);
        break;
      case "sec_challenge":
        setSection(button, 0, 14, "## " + SECTION_TEXT + " {.challenge}\n", 3);
        break;
      case "sec_flag":
        setSection(button, 0, 9, "## " + SECTION_TEXT + " {.flag}\n", 3);
        break;
      case "sec_try":
        setSection(button, 0, 9, "# " + SECTION_TEXT + " {.try}\n", 2);
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
