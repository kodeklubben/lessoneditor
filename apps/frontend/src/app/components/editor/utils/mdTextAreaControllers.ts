import { Dispatch, KeyboardEvent, SetStateAction } from "react";

let orderedListIndex = 2;

export const TABcontroller = (
  setUndoAndUndoPosition: (mdText: string, position: number) => void,
  mdText: string,
  cursorPositionStart: number,
  setMdText: Dispatch<SetStateAction<string>>,
  setCursorPosition: (positionStart: number, positionEnd: number) => void
) => {
  const tabSize = 2;
  setUndoAndUndoPosition(mdText, cursorPositionStart);
  const outputText =
    mdText.slice(0, cursorPositionStart) + " ".repeat(tabSize) + mdText.slice(cursorPositionStart);
  setMdText(outputText);
  const position = cursorPositionStart + tabSize;
  setCursorPosition(position, position);
  return;
};

export const listController = (
  event: KeyboardEvent<HTMLTextAreaElement>,
  buttonValues: Record<string, boolean>,
  listButtonValues: {
    bTitle: string;
    output: string;
    cursorInt: number;
  },
  mdText: string,
  cursorPositionStart: number,
  setButtonValues: Dispatch<SetStateAction<Record<string, boolean>>>,
  setMdText: Dispatch<SetStateAction<string>>,
  setCursorPosition: (positionStart: number, positionEnd: number) => void
) => {
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
      console.log({ orderedListIndex });
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
};
