import { FC, RefObject, Dispatch, SetStateAction } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { onButtonClick, heading as h } from "../utils/buttonMethods";
import { codebuttons } from "../settings/buttonConfig";
import { microbitbuttons, scratchbuttons } from "../settings/microbitAndScratchButtonConfig";
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
  undoCursorPosition,
  redoCursorPosition,
  setUndoCursorPosition,
  setRedoCursorPosition,
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
}) => {
  const setChanges = (mdText: string, cursorPositionStart: number, cursorPositionEnd: number) => {
    if (setCursor && setCursorPosition && setMdText) {
      setCursor(cursorPositionStart, cursorPositionEnd);
      setCursorPosition(cursorPositionStart, cursorPositionEnd);
      setMdText(mdText);
    }
  };

  const toggleButton = (value: string) => {
    if (setButtonValues) {
      setButtonValues((prevButtonValues: Record<string, boolean>) => ({
        ...prevButtonValues,
        [value]: !isON,
      }));
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
    const results = onButtonClick(
      isON,
      cursorIntON,
      cursorIntOFF,
      output,
      mdText,
      cursorPositionStart,
      cursorPositionEnd
    );

    setChanges(
      results.data.mdText,
      results.data.cursorPositionStart,
      results.data.cursorPositionEnd
    );
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
      const results: { isON: boolean; mdText: string; cursorPositionStart: number } = h(
        isON,
        mdText,
        cursorPositionStart,
        output
      );

      setButtonValues((prevButtonValues) => ({
        ...prevButtonValues,
        [buttonTitle]: results?.isON,
      }));
      setChanges(results?.mdText, results?.cursorPositionStart, results?.cursorPositionStart);
    } else if (button === "undo") {
      if (
        undoCursorPosition &&
        setUndoCursorPosition &&
        pushRedoValue &&
        setCursorPosition &&
        undoCursorPosition.length > 0
      ) {
        const position = undoCursorPosition[undoCursorPosition.length - 1];
        setUndoCursorPosition(undoCursorPosition.slice(0, undoCursorPosition.length - 1));
        pushRedoValue(mdText, cursorPositionStart);
        setCursorPosition(position, position);
      } else {
        return;
      }
    } else if (button === "redo") {
      if (
        redoCursorPosition &&
        setRedoCursorPosition &&
        pushUndoValue &&
        setCursorPosition &&
        redoCursorPosition.length > 0
      ) {
        const position = redoCursorPosition[redoCursorPosition.length - 1];
        setRedoCursorPosition(redoCursorPosition.slice(0, redoCursorPosition.length - 1));
        pushUndoValue(mdText, cursorPositionStart);
        setCursorPosition(position, position);
      } else {
        return;
      }
    } else if (button === "listUl" || button === "listOl" || button === "listCheck") {
      toggleButton(buttonTitle);
      if (setListButtonValues) {
        alert("buttonList");
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
