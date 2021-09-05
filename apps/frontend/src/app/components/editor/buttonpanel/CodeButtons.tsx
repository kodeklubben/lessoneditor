import CodeButtonComponent from "./CodeButtonComponent";
import { useHotkeys } from "react-hotkeys-hook";
import { buttonAction as codeAction, cancelButton } from "./utils/buttonMethods";
import { codebutton as config, KEY_COMBINATIONS as KEY } from "./settings/buttonConfig";
import { FC, RefObject } from "react";

export interface CodeButtonsProps {
  editorRef: RefObject<HTMLTextAreaElement>;
  mdText: string;
  cursorPositionStart: number;
  cursorPositionEnd: number;
  buttonValues: Record<string, boolean>;
  setMdText: React.Dispatch<React.SetStateAction<string>>;
  setCursorPosition: (positionStart: number, positionEnd: number) => void;
  setCursor: (pos1: number, pos2: number) => void;
  setButtonValues: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  course: string;
  courseTitle: string;
}

const CodeButtons: FC<CodeButtonsProps> = ({
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

  const setChanges = (mdText: string, cursorPositionStart: number, cursorPositionEnd: number) => {
    setCursor(cursorPositionStart, cursorPositionEnd);
    setCursorPosition(cursorPositionStart, cursorPositionEnd);
    setMdText(mdText);
  };

  const setButton = (value: string) => {
    setButtonValues((prevButtonValues: Record<string, boolean>) => ({
      ...prevButtonValues,
      [value]: !buttonValues[value],
    }));
  };

  const setCode = (button: string, cursorIntON: number, cursorIntOFF: number, output: string) => {
    const cancelResults = cancelButton(
      buttonValues[button],
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

    const results = codeAction(
      buttonValues[button],
      mdText,
      cursorPositionStart,
      cursorPositionEnd,
      cursorIntON,
      cursorIntOFF,
      output
    );

    setChanges(results.mdText, results.cursorPositionStart, results.cursorPositionEnd);
  };

  const set = {
    inline: () => {
      const buttonTitle = config.inline.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.inline.cursorIntON,
        config.inline.cursorIntOFF,
        config.inline.output
      );
    },
    codeblock: () => {
      const buttonTitle = config.codeblock.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.codeblock.cursorIntON + (course === "scratch" ? 6 : course.length),
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

  const handleButtonClick = (button: string) => {
    editorRef.current ? editorRef.current.focus() : "";
    setButtonValues((prevState: Record<string, boolean>) => ({
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
          courseTitle={courseTitle}
          style={element[1].style}
        />
      ))}
    </>
  );
};

export default CodeButtons;
