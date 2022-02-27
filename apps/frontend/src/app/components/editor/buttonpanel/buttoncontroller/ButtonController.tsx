import { FC, RefObject, Dispatch, SetStateAction, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { buttonAction } from "./utils/buttonMethods";
import { DEFAULT_TEXT } from "./settings/buttonConfig";
import { codebuttons, sections } from "./settings/buttonConfig";
import { microbitbuttons, scratchbuttons } from "./settings/microbitAndScratchButtonConfig";
import { RenderButtons } from "./views/RenderButtons";
import { RenderMicroScratchButtons } from "./views/RenderMicroScratchButtons";
import { RenderCodeButtons } from "./views/RenderCodeButtons";

interface ButtonControllerProps {
  editorRef: RefObject<HTMLTextAreaElement>;
  isON: boolean;
  title: string;
  buttonSlug: string;
  shortcutKey: string;
  style?: Record<string, string>;
  imageurl?: string;
  icon?: string;
  undoCursorPosition?: number[];
  redoCursorPosition?: number[];
  setUndoCursorPosition?: React.Dispatch<React.SetStateAction<number[]>>;
  setRedoCursorPosition?: React.Dispatch<React.SetStateAction<number[]>>;
  pushUndoValue?: (mdText: string, cursorPositionStart: number) => void;
  pushRedoValue?: (mdText: string) => void;
  setButtonValues?: Dispatch<SetStateAction<Record<string, boolean>>>;
  setListButtonValues?: React.Dispatch<
    React.SetStateAction<{ bTitle: string; output: string; cursorInt: number }>
  >;
  setCursor?: (pos1: number, pos2: number) => void;
  setCursorPosition: (positionStart: number, positionEnd: number) => void;
  setMdText?: Dispatch<SetStateAction<string>>;
  cursorIntON: number;
  cursorIntOFF: number;
  output: string;
  mdText: string;
  cursorPositionStart: number;
  cursorPositionEnd: number;
  course?: string;
  courseTitle?: string;
  outputOnEnter?: string;
  color?: string;
  setUndoAndUndoPosition?: (mdText: string, position: number) => void;
}

export const ButtonController: FC<ButtonControllerProps> = ({
  editorRef,
  isON,
  title,
  buttonSlug,
  shortcutKey,
  style,
  imageurl,
  icon,
  pushUndoValue,
  pushRedoValue,
  setButtonValues,
  setListButtonValues,
  setCursor,
  setCursorPosition,
  setMdText,
  cursorIntON,
  cursorIntOFF,
  output,
  mdText,
  cursorPositionStart,
  cursorPositionEnd,
  course,
  courseTitle,
  outputOnEnter,
  color,
  setUndoAndUndoPosition,
}) => {
  const [prevTextData, setPrevTextData] = useState<{
    mdText: string;
    cursorPositionStart: number;
    cursorPositionEnd: number;
  }>({ mdText: "", cursorPositionStart: -1, cursorPositionEnd: -1 });

  const setChanges = (mdText: string, cursorPositionStart: number, cursorPositionEnd: number) => {
    if (setCursor && setCursorPosition && setMdText) {
      setCursor(cursorPositionStart, cursorPositionEnd);
      setCursorPosition(cursorPositionStart, cursorPositionEnd);
      setMdText(mdText);
    }
  };

  const toggleButton = (value: string) => {
    if (setButtonValues) {
      setButtonValues({
        [value]: !isON,
      });
    }
  };

  const setButton = (
    isON: boolean,
    cursorIntON: number,
    cursorIntOFF: number,
    output: string,
    mdText: string,
    cursorPositionStart: number,
    cursorPositionEnd: number
  ) => {
    if (!isON) {
      setPrevTextData({ mdText, cursorPositionStart, cursorPositionEnd });

      if (setUndoAndUndoPosition) {
        setUndoAndUndoPosition(mdText, cursorPositionStart);
      }
      const results = buttonAction(
        mdText,
        cursorPositionStart,
        cursorPositionEnd,
        cursorIntON,
        cursorIntOFF,
        output
      );
      setChanges(results.mdText, results.cursorPositionStart, results.cursorPositionEnd);
    } else if (isON) {
      if (
        cursorPositionStart === cursorPositionEnd &&
        cursorPositionStart !== prevTextData.cursorPositionStart
      ) {
        setPrevTextData({ mdText: "", cursorPositionStart: -1, cursorPositionEnd: -1 });
        if (output.slice(-3) === "\n#\n") {
          const position =
            mdText.slice(cursorPositionStart).indexOf("\n#\n") + cursorPositionEnd + 3;
          setChanges(mdText, position, position);
        } else {
          setChanges(
            mdText,
            cursorPositionStart + cursorIntOFF,
            cursorPositionStart + cursorIntOFF
          );
        }
      } else {
        setPrevTextData({ mdText: "", cursorPositionStart: -1, cursorPositionEnd: -1 });
        if (setUndoAndUndoPosition) {
          setUndoAndUndoPosition(mdText, cursorPositionStart);
        }
        setChanges(
          prevTextData.mdText,
          prevTextData.cursorPositionStart,
          prevTextData.cursorPositionEnd
        );
      }
    }
  };

  const set = (button: string) => {
    switch (button) {
      case "codeblock": {
        toggleButton(button);
        setButton(
          isON,
          cursorIntON + (course === "scratch" ? 6 : course?.length || 0),
          cursorIntOFF,
          output.slice(0, 3) + (course === "scratch" ? "blocks" : course) + output.slice(3),
          mdText,
          cursorPositionStart,
          cursorPositionEnd
        );
        break;
      }

      case "undo": {
        if (pushUndoValue) {
          pushUndoValue(mdText, cursorPositionStart);
          break;
        }
        break;
      }

      case "redo": {
        console.log({ mdText });
        if (pushRedoValue) {
          pushRedoValue(mdText);
          break;
        }
        break;
      }

      case "listUl":
      case "listOl":
      case "listCheck": {
        toggleButton(buttonSlug);
        if (setListButtonValues) {
          setListButtonValues({
            bTitle: buttonSlug,
            output: outputOnEnter || "",
            cursorInt: cursorIntON,
          });
        }
        setButton(
          isON,
          cursorIntON,
          cursorIntOFF,
          output,
          mdText,
          cursorPositionStart,
          cursorPositionEnd
        );
        break;
      }

      default: {
        toggleButton(buttonSlug);
        setButton(
          isON,
          cursorIntON,
          cursorIntOFF,
          output,
          mdText,
          cursorPositionStart,
          cursorPositionEnd
        );
      }
    }
  };

  useHotkeys(
    shortcutKey,
    (event) => {
      event.preventDefault();
      set(buttonSlug);
    },
    { enableOnTags: ["TEXTAREA"], keydown: true },
    [toggleButton, setButton]
  );

  const handleButtonClick = (button: string) => {
    if (editorRef) {
      editorRef.current ? editorRef.current.focus() : "";
    }
    set(button);
  };

  const returnContent = (buttonSlug: string) => {
    if (Object.keys(codebuttons).findIndex((item) => item === buttonSlug) > -1) {
      return (
        <RenderCodeButtons
          isON={isON}
          title={title}
          handleButtonClick={handleButtonClick}
          buttonSlug={buttonSlug}
          shortcutKey={shortcutKey}
          style={style || {}}
          courseTitle={courseTitle || ""}
        />
      );
    } else if (
      Object.keys(scratchbuttons).findIndex((item) => item === buttonSlug) > -1 ||
      Object.keys(microbitbuttons).findIndex((item) => item === buttonSlug) > -1
    ) {
      return (
        <RenderMicroScratchButtons
          isON={isON}
          title={title}
          handleButtonClick={handleButtonClick}
          buttonSlug={buttonSlug}
          shortcutKey={shortcutKey}
          color={color || ""}
        />
      );
    } else {
      return (
        <RenderButtons
          isON={isON}
          icon={icon || ""}
          title={title}
          handleButtonClick={handleButtonClick}
          buttonSlug={buttonSlug}
          shortcutKey={shortcutKey}
          style={style || {}}
          imageurl={imageurl || ""}
        />
      );
    }
  };

  return returnContent(buttonSlug);
};
