import { Dispatch, SetStateAction, ChangeEvent, MouseEvent, KeyboardEvent, FC, Ref } from "react";

let orderedListIndex = 2;
const tabSize = 2;

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
  pushUndoValue: (mdText: string, cursorPositionStart: number) => void;
  resetButtons: () => void;
  course: string;
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
  pushUndoValue,
  resetButtons,
  course,
}) => {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCursor(event.target.selectionStart, event.target.selectionEnd);
    const inputText = event.target.value;

    if (inputText[cursorPositionStart] === " " || inputText[cursorPositionStart] === "\n") {
      pushUndoValue(inputText, cursorPositionStart);
    }
    setMdText(inputText);
  };

  const onTextareaKeyUp = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    //setCursor(event.location, event.location);
  };

  const onTextareaSelect = (event: ChangeEvent<HTMLTextAreaElement>) => {
    let start = event.target.selectionStart;
    let end = event.target.selectionEnd;

    if (course === "scratch") {
      course = "blocks";
    }

    setCursor(start, end);
    let i = mdText.slice(start, end);
    while (i[0] === " " || i[i.length - 1] === " " || i[0] === "\n" || i[i.length - 1] === "\n") {
      if (i[0] === " " || i[0] === "\n") {
        i = i.slice(1);
        start += 1;
      }
      if (i[i.length - 1] === " " || i[i.length - 1] === "\n") {
        i = i.slice(0, i.length - 1);
        end -= 1;
      }
    }

    if (
      mdText.slice(start - 1, start) === "*" &&
      mdText.slice(end, end + 1) === "*" &&
      mdText.slice(start - 2, start) !== "**" &&
      !buttonValues.italic
    ) {
      setButtonValues((prevButtonValues: Record<string, boolean>) => ({
        ...prevButtonValues,
        italic: true,
      }));
    }
    if (
      mdText.slice(start, start + 1) === "*" &&
      mdText.slice(end - 1, end) === "*" &&
      mdText.slice(start, start + 2) !== "**" &&
      !buttonValues.bold &&
      end - start > 1
    ) {
      setCursorPosition(start + 1, end - 1);
    }
    if (mdText.slice(start - 2, start) === "**" && mdText.slice(end, end + 2) === "**") {
      setButtonValues((prevButtonValues: Record<string, boolean>) => ({
        ...prevButtonValues,
        bold: true,
      }));
    }

    if (
      mdText.slice(start, start + 2) === "**" &&
      mdText.slice(end - 2, end) === "**" &&
      end - start > 1
    ) {
      setCursorPosition(start + 2, end - 2);
    }
    if (
      mdText.slice(start - 2, start) === "~~" &&
      mdText.slice(end, end + 2) === "~~" &&
      !buttonValues.strikethrough
    ) {
      setButtonValues((prevButtonValues: Record<string, boolean>) => ({
        ...prevButtonValues,
        strikethrough: true,
      }));
    }
    if (
      mdText.slice(start, start + 2) === "~~" &&
      mdText.slice(end - 2, end) === "~~" &&
      end - start > 1
    ) {
      setCursorPosition(start + 2, end - 2);
    }
  };

  const onTextareaMouseDown = (event: MouseEvent<HTMLTextAreaElement>) => {
    resetButtons();
  };

  const onTextareaKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    //setCursor(event.location, event.location);
    if (event.key === "Enter") {
      if (buttonValues[listButtonValues["bTitle"]]) {
        event.preventDefault();

        if (
          mdText.slice(cursorPositionStart - listButtonValues["cursorInt"], cursorPositionStart) ===
            listButtonValues["output"] ||
          mdText.slice(cursorPositionStart - listButtonValues["cursorInt"], cursorPositionStart) ===
            orderedListIndex - 1 + ". "
        ) {
          setButtonValues((prevState: Record<string, boolean>) => ({
            ...prevState,
            [listButtonValues["bTitle"]]: !buttonValues[listButtonValues["bTitle"]],
          }));
          setMdText(
            mdText.slice(0, cursorPositionStart - listButtonValues["cursorInt"]) +
              mdText.slice(cursorPositionStart)
          );
          setCursorPosition(
            cursorPositionStart - listButtonValues["cursorInt"],
            cursorPositionStart - listButtonValues["cursorInt"]
          );
          orderedListIndex = 2;
          return;
        }
        if (listButtonValues["bTitle"] === "listOl") {
          setMdText(
            mdText.slice(0, cursorPositionStart) +
              "\n\n" +
              (orderedListIndex + ". ") +
              mdText.slice(cursorPositionStart)
          );
          setCursorPosition(
            cursorPositionStart + listButtonValues["cursorInt"] + 2,
            cursorPositionStart + listButtonValues["cursorInt"] + 2
          );
          orderedListIndex++;
          return;
        }

        setMdText(
          mdText.slice(0, cursorPositionStart) +
            "\n\n" +
            listButtonValues["output"] +
            mdText.slice(cursorPositionStart)
        );
        setCursorPosition(
          cursorPositionStart + listButtonValues["cursorInt"] + 2,
          cursorPositionStart + listButtonValues["cursorInt"] + 2
        );
        return;
      }

      if (buttonValues["heading"]) {
        setButtonValues((prevButtonValues: Record<string, boolean>) => ({
          ...prevButtonValues,
          heading: !buttonValues["heading"],
        }));
      }

      if (mdText.slice(cursorPositionStart, cursorPositionStart + 3) === " {.") {
        let i = cursorPositionStart;
        while (mdText[i] !== "\n") {
          i++;
        }
        setCursorPosition(i, i);
      }
    }

    if (event.key === "Tab") {
      event.preventDefault();
      pushUndoValue(mdText, cursorPositionStart);
      const outputText =
        mdText.slice(0, cursorPositionStart) +
        " ".repeat(tabSize) +
        mdText.slice(cursorPositionStart);
      setMdText(outputText);
      const position = cursorPositionStart + tabSize;
      setCursorPosition(position, position);
      return;
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
      onKeyUp={onTextareaKeyUp}
      onMouseDown={onTextareaMouseDown}
      onSelect={onTextareaSelect}
    />
  );
};

export default MDTextArea;
