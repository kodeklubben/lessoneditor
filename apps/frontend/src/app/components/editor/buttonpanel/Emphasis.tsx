import ButtonComponent from "./ButtonComponent";
import { useHotkeys } from "react-hotkeys-hook";
import { buttonAction as emphasisAction, cancelButton, heading } from "./utils/buttonMethods";
import { emphasis as config, KEY_COMBINATIONS as KEY } from "./settings/buttonConfig";
import { FC, RefObject } from "react";

interface EmphasisProps {
  editorRef: RefObject<HTMLTextAreaElement>;
  mdText: string;
  buttonValues: Record<string, boolean>;
  cursorPositionStart: number;
  cursorPositionEnd: number;
  setMdText: React.Dispatch<React.SetStateAction<string>>;
  setCursorPosition: (positionStart: number, positionEnd: number) => void;
  setCursor: (pos1: number, pos2: number) => void;
  setButtonValues: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

const Emphasis: FC<EmphasisProps> = ({
  editorRef,
  mdText,
  buttonValues,
  cursorPositionStart,
  cursorPositionEnd,
  setMdText,
  setCursorPosition,
  setCursor,
  setButtonValues,
}) => {
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

  const setEmphasis = (
    isON: boolean,
    cursorIntON: number,
    cursorIntOFF: number,
    output: string
  ) => {
    const cancelResults = cancelButton(
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

    const results = emphasisAction(
      isON,
      mdText,
      cursorPositionStart,
      cursorPositionEnd,
      cursorIntON,
      cursorIntOFF,
      output
    );

    setChanges(results?.mdText, results?.cursorPositionStart, results?.cursorPositionEnd);
  };

  const set = {
    bold: () => {
      const buttonTitle = config.bold.buttonTitle;
      setButton(buttonTitle);
      setEmphasis(
        buttonValues[buttonTitle],
        config.bold.cursorIntON,
        config.bold.cursorIntOFF,
        config.bold.output
      );
    },
    italic: () => {
      const buttonTitle = config.italic.buttonTitle;
      setButton(buttonTitle);
      setEmphasis(
        buttonValues[buttonTitle],
        config.italic.cursorIntON,
        config.italic.cursorIntOFF,
        config.italic.output
      );
    },
    heading: () => {
      const buttonTitle = config.heading.buttonTitle;
      const output = config.heading.output;

      const results = heading(buttonValues[buttonTitle], mdText, cursorPositionStart, output);
      setButtonValues((prevButtonValues) => ({
        ...prevButtonValues,
        [buttonTitle]: results?.isOn,
      }));
      setChanges(results?.mdText, results?.cursorPositionStart, results?.cursorPositionStart);
    },
    strikethrough: () => {
      const buttonTitle = config.strikethrough.buttonTitle;
      setButton(buttonTitle);
      setEmphasis(
        buttonValues[buttonTitle],
        config.strikethrough.cursorIntON,
        config.strikethrough.cursorIntOFF,
        config.strikethrough.output
      );
    },
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

  const handleButtonClick = (button: string) => {
    editorRef.current ? editorRef.current.focus() : "";
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
            style={{}}
            imageurl=""
          />
        );
      })}
    </div>
  );
};

export default Emphasis;
