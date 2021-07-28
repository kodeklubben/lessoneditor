import CodeButtonComponent from "./CodeButtonComponent";
import { useHotkeys } from "react-hotkeys-hook";
import {
  buttonAction as codeAction,
  cancelButton,
} from "./utils/buttonMethods";
import {
  codebutton as config,
  KEY_COMBINATIONS as KEY,
} from "./settings/buttonConfig";
import { FC } from "react";

let results;
let cancelResults;
let buttonTitle;

const CodeButton: FC<any> = ({
  editorRef,
  mdText,
  cursorPositionStart,
  cursorPositionEnd,
  buttonValues,
  setMdText,
  setCursorPosition,
  setCursor,
  setButtonValues,
  course,
  courseTitle,
}) => {
  const outputCodeBlock =
    config.codeblock.output.slice(0, 3) +
    (course === "scratch" ? "blocks" : course) +
    config.codeblock.output.slice(3);

  const setChanges = (
    mdText: string,
    cursorPositionStart: number,
    cursorPositionEnd: number
  ) => {
    setCursor(cursorPositionStart, cursorPositionEnd);
    setCursorPosition(cursorPositionStart, cursorPositionEnd);
    setMdText(mdText);
  };

  const setButton = (value: string) => {
    setButtonValues((prevButtonValues: any) => ({
      ...prevButtonValues,
      [value]: !buttonValues[value],
    }));
  };

  const setCode = (
    button: any,
    cursorIntON: any,
    cursorIntOFF: any,
    output: any
  ) => {
    cancelResults = cancelButton(
      buttonValues[button],
      mdText,
      cursorPositionStart,
      cursorPositionEnd,
      cursorIntON,
      output
    );
    if (cancelResults.cancel) {

      setChanges(
          // @ts-ignore
        cancelResults?.mdText,
        cancelResults?.cursorPositionStart,
        cancelResults?.cursorPositionEnd
      );
      return;
    }

    results = codeAction(
      buttonValues[button],
      mdText,
      cursorPositionStart,
      cursorPositionEnd,
      cursorIntON,
      cursorIntOFF,
      output
    );

    setChanges(
        // @ts-ignore
      results?.mdText,
      results?.cursorPositionStart,
      results?.cursorPositionEnd
    );
  };

  const set = {
    inline: () => {
      buttonTitle = config.inline.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.inline.cursorIntON,
        config.inline.cursorIntOFF,
        config.inline.output
      );
    },
    codeblock: () => {
      buttonTitle = config.codeblock.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.codeblock.cursorIntON +
          (course === "scratch" ? 6 : course.length),
        config.codeblock.cursorIntOFF,
        outputCodeBlock
      );
    },
  };

  useHotkeys(
    `${KEY.inline}, ${KEY.codeblock}`,
    (event, handler) => {
      event.preventDefault();
      switch (handler.key) {
        case KEY.inline:
          set.inline();
          break;
        case KEY.codeblock:
          set.codeblock();
          break;
        default:
          break;
      }
      return false;
    },
    { enableOnTags: ["TEXTAREA"], keydown: true },
    [setButton, setCode]
  );

  const handleButtonClick = (button: any) => {
    editorRef.current.focus();
    setButtonValues((prevState: any) => ({
      ...prevState,
      [button]: !buttonValues[button],
    }));
    switch (button) {
      case config.inline.buttonTitle:
        set.inline();
        break;
      case config.codeblock.buttonTitle:
        set.codeblock();
        break;
      default:
        break;
    }
  };
  return (
    <>
      {Object.entries(config).map((element, index) => (
        <CodeButtonComponent
          key={"element" + index}
          buttonValues={buttonValues}
          title={element[1].title}
          onButtonClick={handleButtonClick}
          buttonTitle={element[1].buttonTitle}
          shortcutKey={element[1].shortcut}
          course={course}
          courseTitle={courseTitle}
          style={element[1].style}
        />
      ))}
    </>
  );
};

export default CodeButton;
