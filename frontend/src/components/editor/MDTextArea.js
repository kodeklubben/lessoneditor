import React from "react";

let orderedListIndex = 2;
let tabSize = 2;

const MDTextArea = ({
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
}) => {
  const getButtonName = (mdText, cursorPositionStart) => {
    let output = "";
    let i = cursorPositionStart;
    while (mdText[i] !== "}") {
      output += mdText[i];
      i++;
    }
    console.log(output);
    return output;
  };

  const handleChange = (event) => {
    setCursor(event.target.selectionStart, event.target.selectionEnd);
    let inputText = event.target.value;
    if (
      inputText[cursorPositionStart] === " " ||
      inputText[cursorPositionStart] === "\n"
    ) {
      pushUndoValue(inputText, cursorPositionStart);
    }
    setMdText(inputText);
  };

  const onTextareaKeyUp = (event) => {
    setCursor(event.target.selectionStart, event.target.selectionEnd);
  };

  const onTextareaSelect = (event) => {
    let start = event.target.selectionStart;
    let end = event.target.selectionEnd;
    setCursor(start, end);
    if (
      mdText.slice(start - 1, start) === "_" &&
      mdText.slice(end, end + 1) === "_" &&
      mdText.slice(start - 2, start) !== "__" &&
      !buttonValues.italic
    ) {
      setButtonValues((prevButtonValues) => ({
        ...prevButtonValues,
        italic: true,
      }));
    }
    if (
      mdText.slice(start, start + 1) === "_" &&
      mdText.slice(end - 1, end) === "_" &&
      mdText.slice(start, start + 2) !== "__" &&
      !buttonValues.bold
    ) {
      setCursorPosition(start + 1, end - 1);
    }
    if (
      mdText.slice(start - 2, start) === "__" &&
      mdText.slice(end, end + 2) === "__"
    ) {
      setButtonValues((prevButtonValues) => ({
        ...prevButtonValues,
        bold: true,
      }));
    }

    if (
      mdText.slice(start, start + 2) === "__" &&
      mdText.slice(end - 2, end) === "__"
    ) {
      setCursorPosition(start + 2, end - 2);
    }
    if (
      mdText.slice(start - 2, start) === "~~" &&
      mdText.slice(end, end + 2) === "~~" &&
      !buttonValues.strikethrough
    ) {
      setButtonValues((prevButtonValues) => ({
        ...prevButtonValues,
        strikethrough: true,
      }));
    }
    if (
      mdText.slice(start, start + 2) === "~~" &&
      mdText.slice(end - 2, end) === "~~"
    ) {
      setCursorPosition(start + 2, end - 2);
    }
    if (
      mdText.slice(start - 1, start) === "`" &&
      mdText.slice(end, end + 1) === "`" &&
      mdText.slice(end, end + 2) !== "``"
    ) {
      if (mdText.slice(end, end + 11) === "`{.microbit") {
        let buttonName = getButtonName(mdText, end + 11);
        if (!buttonValues[buttonName]) {
          setButtonValues((prevButtonValues) => ({
            ...prevButtonValues,
            [buttonName]: true,
          }));
          return;
        }
      } else if (mdText.slice(end, end + 7) === "`{.block") {
        let buttonName = getButtonName(mdText, end + 7);
        if (!buttonValues[buttonName]) {
          setButtonValues((prevButtonValues) => ({
            ...prevButtonValues,
            [buttonName]: true,
          }));
          return;
        }
      } else if (!buttonValues.inline) {
        setButtonValues((prevButtonValues) => ({
          ...prevButtonValues,
          inline: true,
        }));
      }
    }
    if (
      mdText.slice(start, start + 1) === "`" &&
      (mdText.slice(end - 1, end) === "}" ||
        mdText.slice(end - 1, end) === "`") &&
      mdText.slice(end - 2, end) !== "``"
    ) {
      let i = end;
      while (mdText[i] !== "`") {
        i--;
      }

      setCursorPosition(start + 1, i);
    }
  };

  const onTextareaMouseDown = (event) => {
    setCursor(event.target.selectionStart, event.target.selectionEnd);

    resetButtons();
  };

  const onTextareaKeyDown = (event) => {
    setCursor(event.target.selectionStart, event.target.selectionEnd);

    if (event.key === "Enter") {
      if (buttonValues[listButtonValues["bTitle"]]) {
        event.preventDefault();

        if (
          mdText.slice(
            cursorPositionStart - listButtonValues["cursorInt"],
            cursorPositionStart
          ) === listButtonValues["output"] ||
          mdText.slice(
            cursorPositionStart - listButtonValues["cursorInt"],
            cursorPositionStart
          ) ===
            orderedListIndex - 1 + ". "
        ) {
          setButtonValues((prevState) => ({
            ...prevState,
            [listButtonValues["bTitle"]]: !buttonValues[
              listButtonValues["bTitle"]
            ],
          }));
          setMdText(
            mdText.slice(
              0,
              cursorPositionStart - listButtonValues["cursorInt"]
            ) + mdText.slice(cursorPositionStart)
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
        setButtonValues((prevButtonValues) => ({
          ...prevButtonValues,
          heading: !buttonValues["heading"],
        }));
      }

      if (
        mdText.slice(cursorPositionStart, cursorPositionStart + 3) === " {."
      ) {
        let i = cursorPositionStart;
        while (mdText[i] !== "\n") {
          i++;
        }
        setCursorPosition(i, i);
        setButtonValues({});
      }
    }

    if (event.key === "Tab") {
      event.preventDefault();
      pushUndoValue(mdText, cursorPositionStart);
      let outputText =
        mdText.slice(0, cursorPositionStart) +
        " ".repeat(tabSize) +
        mdText.slice(cursorPositionStart);
      setMdText(outputText);
      let position = cursorPositionStart + tabSize;
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
      className="TextArea"
      value={mdText}
      onChange={(event) => handleChange(event)}
      onKeyDown={(event) => onTextareaKeyDown(event)}
      onKeyUp={(event) => onTextareaKeyUp(event)}
      onMouseDown={(event) => onTextareaMouseDown(event)}
      onTouchEnd={(event) => onTextareaMouseDown(event)}
      onSelect={(event) => onTextareaSelect(event)}
      // onWheel={event => onTextareaMouseDown(event)}
    />
  );
};

export default MDTextArea;
