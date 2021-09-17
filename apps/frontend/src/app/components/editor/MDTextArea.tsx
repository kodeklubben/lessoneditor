import { Dispatch, SetStateAction, ChangeEvent, MouseEvent, KeyboardEvent, FC, Ref } from "react";
import { listController, TABcontroller, textSelectController } from "./utils/mdTextAreaControllers";

interface MDTextAreaProps {
  editorRef: Ref<HTMLTextAreaElement>;
  mdText: string;
  buttonValues: Record<string, boolean>;
  listButtonValues: {
    bTitle: string;
    output: string;
    cursorInt: number;
  };
  cursorPositionStart: number;
  setCursorPosition: (positionStart: number, positionEnd: number) => void;
  setMdText: Dispatch<SetStateAction<string>>;
  setButtonValues: Dispatch<SetStateAction<Record<string, boolean>>>;
  setCursor: (pos1: number, pos2: number) => void;
  setUndoAndCursorPosition: (mdText: string, position: number) => void;
  resetButtons: () => void;
}

const MDTextArea: FC<MDTextAreaProps> = ({
  editorRef,
  mdText,
  buttonValues,
  listButtonValues,
  cursorPositionStart,
  setCursorPosition,
  setMdText,
  setButtonValues,
  setCursor,
  setUndoAndCursorPosition,
  resetButtons,
}) => {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCursor(event.target.selectionStart, event.target.selectionEnd);
    const inputText = event.target.value;

    setMdText(inputText);
    if (inputText[cursorPositionStart] === " " || inputText[cursorPositionStart] === "\n") {
      setUndoAndCursorPosition(inputText, cursorPositionStart);
    }
  };

  const onTextareaSelect = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const start = event.target.selectionStart;
    const end = event.target.selectionEnd;
    if (mdText) {
      textSelectController(
        start,
        end,
        setCursor,
        mdText,
        buttonValues,
        setButtonValues,
        setCursorPosition
      );
    }
  };

  const onTextareaMouseDown = (event: MouseEvent<HTMLTextAreaElement>) => {
    resetButtons();
  };

  const onTextareaKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      if (mdText) {
        listController(
          event,
          buttonValues,
          listButtonValues,
          mdText,
          cursorPositionStart,
          setButtonValues,
          setMdText,
          setCursorPosition
        );
      }
    }

    if (event.key === "Tab") {
      event.preventDefault();
      TABcontroller(
        setUndoAndCursorPosition,
        mdText,
        cursorPositionStart,
        setMdText,
        setCursorPosition
      );
    }

    if (
      event.key === "ArrowLeft" ||
      event.key === "ArrowUp" ||
      event.key === "ArrowRight" ||
      event.key === "ArrowDown"
    ) {
      resetButtons();
    }
  };

  return (
    <textarea
      autoFocus
      ref={editorRef}
      className="text-area"
      value={mdText}
      onChange={handleChange}
      onKeyDown={onTextareaKeyDown}
      onMouseDown={onTextareaMouseDown}
      onSelect={onTextareaSelect}
    />
  );
};

export default MDTextArea;
