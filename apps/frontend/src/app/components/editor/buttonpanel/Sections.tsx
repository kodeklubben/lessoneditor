import ButtonComponent from "./ButtonComponent";

import { useHotkeys } from "react-hotkeys-hook";

import { cancelButton, insertSection } from "./utils/buttonMethods";
import { KEY_COMBINATIONS as KEY, sections as config } from "./settings/buttonConfig";
import { SECTION_TEXT } from "../settingsFiles/languages/editor_NO";
import { FC } from "react";

let results;
let cancelResults;
let buttonTitle;

const Sections: FC<any> = ({
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
  const setChanges = (mdText: any, cursorPositionStart: any, cursorPositionEnd: any) => {
    setCursor(cursorPositionStart, cursorPositionEnd);
    setCursorPosition(cursorPositionStart, cursorPositionEnd);
    setMdText(mdText);
  };

  const setButton = (value: any) => {
    setButtonValues((prevButtonValues: any) => ({
      ...prevButtonValues,
      [value]: !buttonValues[value],
    }));
  };

  const setSection = (
    button: any,
    cursorIntON: any,
    cursorIntOFF: any,
    output: any,
    cancelInt: any
  ) => {
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

    setChanges(results?.mdText, results?.cursorPositionStart, results?.cursorPositionEnd);
  };

  const set = {
    activity: () => {
      buttonTitle = config.activity.buttonTitle;
      setButton(buttonTitle);
      setSection(
        buttonTitle,
        config.activity.cursorIntON,
        config.activity.cursorIntOFF,
        config.activity.output,
        config.activity.cancelInt
      );
    },
    intro: () => {
      buttonTitle = config.intro.buttonTitle;
      setButton(buttonTitle);
      setSection(
        buttonTitle,
        config.intro.cursorIntON,
        config.intro.cursorIntOFF,
        config.intro.output,
        config.intro.cancelInt
      );
    },
    check: () => {
      buttonTitle = config.check.buttonTitle;
      setButton(buttonTitle);
      setSection(
        buttonTitle,
        config.check.cursorIntON,
        config.check.cursorIntOFF,
        config.check.output,
        config.check.cancelInt
      );
    },
    tip: () => {
      buttonTitle = config.tip.buttonTitle;
      setButton(buttonTitle);
      setSection(
        buttonTitle,
        config.tip.cursorIntON,
        config.tip.cursorIntOFF,
        config.tip.output,
        config.tip.cancelInt
      );
    },
    protip: () => {
      buttonTitle = config.protip.buttonTitle;
      setButton(buttonTitle);
      setSection(
        buttonTitle,
        config.protip.cursorIntON,
        config.protip.cursorIntOFF,
        config.protip.output,
        config.protip.cancelInt
      );
    },
    challenge: () => {
      buttonTitle = config.challenge.buttonTitle;
      setButton(buttonTitle);
      setSection(
        buttonTitle,
        config.challenge.cursorIntON,
        config.challenge.cursorIntOFF,
        config.challenge.output,
        config.challenge.cancelInt
      );
    },
    flag: () => {
      buttonTitle = config.flag.buttonTitle;
      setButton(buttonTitle);
      setSection(
        buttonTitle,
        config.flag.cursorIntON,
        config.flag.cursorIntOFF,
        config.flag.output,
        config.flag.cancelInt
      );
    },
    try: () => {
      buttonTitle = config.try.buttonTitle;
      setButton(buttonTitle);
      setSection(
        buttonTitle,
        config.try.cursorIntON,
        config.try.cursorIntOFF,
        config.try.output,
        config.try.cancelInt
      );
    },
    save: () => {
      buttonTitle = config.save.buttonTitle;
      setButton(buttonTitle);
      setSection(
        buttonTitle,
        config.save.cursorIntON,
        config.save.cursorIntOFF,
        config.save.output,
        config.save.cancelInt
      );
    },
  };

  useHotkeys(
    `${KEY.activity}, ${KEY.intro}, ${KEY.check}, ${KEY.tip}, ` +
      `${KEY.protip}, ${KEY.challenge}, ${KEY.flag}, ${KEY.try}, ${KEY.save}`,
    (event, handler) => {
      event.preventDefault();
      switch (handler.key) {
        case KEY.activity:
          set.activity();
          break;
        case KEY.intro:
          set.intro();
          break;
        case KEY.check:
          set.check();
          break;
        case KEY.tip:
          set.tip();
          break;
        case KEY.protip:
          set.protip();
          break;
        case KEY.challenge:
          set.challenge();
          break;
        case KEY.flag:
          set.flag();
          break;
        case KEY.try:
          set.try();
          break;
        case KEY.save:
          set.save();
          break;
        default:
          break;
      }
      return false;
    },
    { enableOnTags: ["TEXTAREA"], keydown: true },
    [setButton, setSection]
  );

  const handleButtonClick = (button: any) => {
    editorRef.current.focus();
    switch (button) {
      case config.activity.buttonTitle:
        set.activity();
        break;
      case config.intro.buttonTitle:
        set.intro();
        break;
      case config.check.buttonTitle:
        set.check();
        break;
      case config.tip.buttonTitle:
        set.tip();
        break;
      case config.protip.buttonTitle:
        set.protip();
        break;
      case config.challenge.buttonTitle:
        set.challenge();
        break;
      case config.flag.buttonTitle:
        set.flag();
        break;
      case config.try.buttonTitle:
        set.try();
        break;
      case config.save.buttonTitle:
        set.save();
        break;
      default:
        break;
    }
  };
  return (
    <>
      {Object.entries(config).map((element, index) => (
        <ButtonComponent
          key={"element" + index}
          buttonValues={buttonValues}
          icon=""
          title={element[1].title}
          onButtonClick={handleButtonClick}
          buttonTitle={element[1].buttonTitle}
          shortcutKey={element[1].shortcut}
          style={element[1].style}
          imageurl={element[1].imageurl ? element[1].imageurl : ""}
        />
      ))}
    </>
  );
};

export default Sections;
