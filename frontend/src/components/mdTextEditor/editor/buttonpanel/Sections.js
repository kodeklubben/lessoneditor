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
  let h1 = "# ";
  let h2 = "## ";

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

  const handleButtonClick = (button) => {
    editorRef.current.focus();
    setButtonValues((prevState) => ({
      ...prevState,
      [button]: !buttonValues[button],
    }));
    switch (button) {
      case "sec_activity":
        setSection(
          button,
          0,
          13,
          h1 + SECTION_TEXT + " {.activity}\n",
          h1.length
        );
        break;
      case "sec_intro":
        setSection(button, 0, 10, h1 + SECTION_TEXT + " {.intro}\n", h1.length);
        break;
      case "sec_check":
        setSection(button, 0, 10, h2 + SECTION_TEXT + " {.check}\n", h2.length);
        break;
      case "sec_tip":
        setSection(button, 10, 10, "## {.tip}\n" + SECTION_TEXT, 10);
        break;
      case "sec_protip":
        setSection(
          button,
          0,
          11,
          h2 + SECTION_TEXT + " {.protip}\n",
          h2.length
        );
        break;
      case "sec_challenge":
        setSection(
          button,
          0,
          14,
          h2 + SECTION_TEXT + " {.challenge}\n",
          h2.length
        );
        break;
      case "sec_flag":
        setSection(button, 0, 9, h2 + SECTION_TEXT + " {.flag}\n", h2.length);
        break;
      case "sec_try":
        setSection(button, 0, 9, h1 + SECTION_TEXT + " {.try}\n", h1.length);
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
            onButtonClick={handleButtonClick}
            shortcutKey={element.shortcut}
          />
        ))}
      </div>
    </>
  );
};

export default Sections;
