import { FC, RefObject, Dispatch, SetStateAction, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { buttonAction, heading } from "./utils/buttonMethods";
import { DEFAULT_TEXT } from "./settings/buttonConfig";
import { codebuttons } from "./settings/buttonConfig";
import { microbitbuttons, scratchbuttons } from "./settings/microbitAndScratchButtonConfig";
import { RenderButtons } from "./views/RenderButtons";
import { RenderMicroScratchButtons } from "./views/RenderMicroScratchButtons";
import { RenderCodeButtons } from "./views/RenderCodeButtons";

interface ButtonControllerProps {
  editorRef: RefObject<HTMLTextAreaElement>;
  isON: boolean;
  title: string;
  buttonTitle: string;
  shortcutKey: string;
  style?: Record<string, string>;
  imageurl?: string;
  icon?: string;
  undoCursorPosition?: number[];
  redoCursorPosition?: number[];
  setUndoCursorPosition?: React.Dispatch<React.SetStateAction<number[]>>;
  setRedoCursorPosition?: React.Dispatch<React.SetStateAction<number[]>>;
  pushUndoValue?: (mdText: string, cursorPositionStart: number) => void;
  pushRedoValue?: (mdText: string, cursorPositionStart: number) => void;
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
  setUndoAndCursorPosition?: (mdText: string, position: number) => void;
}

export const ButtonController: FC<ButtonControllerProps> = ({
  editorRef,
  isON,
  title,
  buttonTitle,
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
  setUndoAndCursorPosition,
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
    if (!isON && !prevTextData.mdText) {
      setPrevTextData({ mdText, cursorPositionStart, cursorPositionEnd });

      if (setUndoAndCursorPosition) {
        setUndoAndCursorPosition(mdText, cursorPositionStart);
      }
      const results = buttonAction(
        isON,
        mdText,
        cursorPositionStart,
        cursorPositionEnd,
        cursorIntON,
        cursorIntOFF,
        output
      );
      setChanges(results.mdText, results.cursorPositionStart, results.cursorPositionEnd);
    } else if (isON && mdText.slice(cursorPositionStart, cursorPositionEnd) !== DEFAULT_TEXT) {
      setPrevTextData({ mdText: "", cursorPositionStart: -1, cursorPositionEnd: -1 });

      setChanges(mdText, cursorPositionStart + cursorIntOFF, cursorPositionEnd + cursorIntOFF);
    } else {
      setPrevTextData({ mdText: "", cursorPositionStart: -1, cursorPositionEnd: -1 });
      if (setUndoAndCursorPosition) {
        setUndoAndCursorPosition(mdText, cursorPositionStart);
      }
      setChanges(
        prevTextData.mdText,
        prevTextData.cursorPositionStart,
        prevTextData.cursorPositionEnd
      );
    }
  };

  const set = (button: string) => {
    if (button === "codeblock") {
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
    } else if (setButtonValues && button === "heading") {
      if (buttonTitle) {
        setPrevTextData({ mdText, cursorPositionStart, cursorPositionEnd });
      }
      const results: { isON: boolean; mdText: string; cursorPositionStart: number } = heading(
        isON,
        mdText,
        cursorPositionStart,
        output
      );

      setButtonValues((prevButtonValues) => ({
        ...prevButtonValues,
        [buttonTitle]: results.isON,
      }));
      setChanges(results.mdText, results.cursorPositionStart, results.cursorPositionStart);
    } else if (button === "undo") {
      if (pushUndoValue) {
        pushUndoValue(mdText, cursorPositionStart);
      } else {
        return;
      }
    } else if (button === "redo") {
      if (pushRedoValue) {
        pushRedoValue(mdText, cursorPositionStart);
      } else {
        return;
      }
    } else if (button === "listUl" || button === "listOl" || button === "listCheck") {
      toggleButton(buttonTitle);
      if (setListButtonValues) {
        setListButtonValues({
          bTitle: buttonTitle,
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
    } else {
      toggleButton(buttonTitle);
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
  };

  useHotkeys(
    shortcutKey,
    (event) => {
      event.preventDefault();
      set(buttonTitle);
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

  const returnType = (buttonTitle: string) => {
    if (Object.keys(codebuttons).filter((item) => item === buttonTitle).length > 0) {
      return (
        <RenderCodeButtons
          isON={isON}
          title={title}
          handleButtonClick={handleButtonClick}
          buttonTitle={buttonTitle}
          shortcutKey={shortcutKey}
          style={style || {}}
          courseTitle={courseTitle || ""}
        />
      );
    } else if (
      Object.keys(scratchbuttons).filter((item) => item === buttonTitle).length > 0 ||
      Object.keys(microbitbuttons).filter((item) => item === buttonTitle).length > 0
    ) {
      return (
        <RenderMicroScratchButtons
          isON={isON}
          title={title}
          handleButtonClick={handleButtonClick}
          buttonTitle={buttonTitle}
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
          buttonTitle={buttonTitle}
          shortcutKey={shortcutKey}
          style={style || {}}
          imageurl={imageurl || ""}
        />
      );
    }
  };

  return returnType(buttonTitle);
};
