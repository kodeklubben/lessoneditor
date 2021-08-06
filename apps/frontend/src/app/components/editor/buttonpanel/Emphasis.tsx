import ButtonComponent from "./ButtonComponent";
import { useHotkeys } from "react-hotkeys-hook";
import { buttonAction as emphasisAction, cancelButton, heading } from "./utils/buttonMethods";
import { emphasis as config, KEY_COMBINATIONS as KEY } from "./settings/buttonConfig";
import { FC } from "react";

const Emphasis: FC<any> = ({
                             editorRef,
                             mdText,
                             buttonValues,
                             cursorPositionStart,
                             cursorPositionEnd,
                             setMdText,
                             setCursorPosition,
                             setCursor,
                             setButtonValues
                           }) => {
  let output;
  let cancelResults;
  let results: {
    cursorPositionEnd?: any;
    cursorPositionStart?: any;
    isOn: any;
    mdText: any;
  };
  let buttonTitle: string;

  const setChanges = (
    mdText: any,
    cursorPositionStart: any,
    cursorPositionEnd: any
  ) => {
    setCursor(cursorPositionStart, cursorPositionEnd);
    setCursorPosition(cursorPositionStart, cursorPositionEnd);
    setMdText(mdText);
  };

  const setButton = (value: any) => {
    setButtonValues((prevButtonValues: any) => ({
      ...prevButtonValues,
      [value]: !buttonValues[value]
    }));
  };

  const setEmphasis = (
    isON: any,
    cursorIntON: any,
    cursorIntOFF: any,
    output: any
  ) => {
    cancelResults = cancelButton(
      isON,
      mdText,
      cursorPositionStart,
      cursorPositionEnd,
      cursorIntON,
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

    // @ts-ignore
    results = emphasisAction(
      isON,
      mdText,
      cursorPositionStart,
      cursorPositionEnd,
      cursorIntON,
      cursorIntOFF,
      output
    );

    setChanges(
      results?.mdText,
      results?.cursorPositionStart,
      results?.cursorPositionEnd
    );
  };

  const set = {
    bold: () => {
      buttonTitle = config.bold.buttonTitle;
      setButton(buttonTitle);
      setEmphasis(
        buttonValues[buttonTitle],
        config.bold.cursorIntON,
        config.bold.cursorIntOFF,
        config.bold.output
      );
    },
    italic: () => {
      buttonTitle = config.italic.buttonTitle;
      setButton(buttonTitle);
      setEmphasis(
        buttonValues[buttonTitle],
        config.italic.cursorIntON,
        config.italic.cursorIntOFF,
        config.italic.output
      );
    },
    heading: () => {
      buttonTitle = config.heading.buttonTitle;
      output = config.heading.output;

      results = heading(
        buttonValues[buttonTitle],
        mdText,
        cursorPositionStart,
        output
      );
      setButtonValues((prevButtonValues: any) => ({
        ...prevButtonValues,
        [buttonTitle]: results?.isOn
      }));
      setChanges(
        results?.mdText,
        results?.cursorPositionStart,
        results?.cursorPositionStart
      );
    },
    strikethrough: () => {
      buttonTitle = config.strikethrough.buttonTitle;
      setButton(buttonTitle);
      setEmphasis(
        buttonValues[buttonTitle],
        config.strikethrough.cursorIntON,
        config.strikethrough.cursorIntOFF,
        config.strikethrough.output
      );
    }
  };

  useHotkeys(
    `${KEY.bold}, ${KEY.italic}, ${KEY.heading}, ${KEY.strikethrough}`,
    (event, handler) => {
      event.preventDefault();
      switch (handler.key) {
        case KEY.bold:
          set.bold();
          break;
        case KEY.italic:
          set.italic();
          break;
        case KEY.heading:
          set.heading();
          break;
        case KEY.strikethrough:
          set.strikethrough();
          break;
        default:
          break;
      }
      return false;
    },
    { enableOnTags: ["TEXTAREA"], keydown: true },
    [setButton, setEmphasis, heading]
  );

  const handleButtonClick = (button: any) => {
    editorRef.current.focus();
    switch (button) {
      case config.bold.buttonTitle:
        set.bold();
        break;
      case config.italic.buttonTitle:
        set.italic();
        break;
      case config.heading.buttonTitle:
        set.heading();
        break;
      case config.strikethrough.buttonTitle:
        set.strikethrough();
        break;
      default:
        break;
    }
  };
  return (
    <div>
      {Object.entries(config).map((element, index) => {
        return (
          <ButtonComponent
            key={"element" + index}
            buttonValues={buttonValues}
            icon={element[1].icon}
            title={element[1].title}
            onButtonClick={handleButtonClick}
            buttonTitle={element[1].buttonTitle}
            shortcutKey={element[1].shortcut}
          />
        );
      })}
    </div>
  );
};

export default Emphasis;
