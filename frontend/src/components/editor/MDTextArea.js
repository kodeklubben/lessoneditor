import React from "react";

let orderedListIndex = 2;
let tabSize = 2;

const segments = [
  "intro",
  "activity",
  "check",
  "tip",
  "protip",
  "challenge",
  "flag",
  "try",
  "save",
];

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
  course,
}) => {
  const getButtonName = (cursorPositionStart) => {
    let output = "";
    let i = cursorPositionStart;
    while (mdText[i] !== "}") {
      output += mdText[i];
      i++;
    }
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

    if (course === "scratch") {
      course = "blocks";
    }

    setCursor(start, end);
    let i = mdText.slice(start, end);
    while (
      i[0] === " " ||
      i[i.length - 1] === " " ||
      i[0] === "\n" ||
      i[i.length - 1] === "\n"
    ) {
      if (i[0] === " " || i[0] === "\n") {
        i = i.slice(1);
        start += 1;
      }
      if (i[i.length - 1] === " " || i[i.length - 1] === "\n") {
        i = i.slice(0, i.length - 1);
        end -= 1;
      }
    }

    //______

    if (
      mdText.slice(start - 2, start) === "# " &&
      mdText.slice(end, end + 2) === " {"
    ) {
      let buttonName = getButtonName(end + 3);
      if (!segments.includes(buttonName)) return;
      setButtonValues((prevButtonValues) => ({
        ...prevButtonValues,
        ["sec_" + buttonName]: true,
      }));
    }

    if (
      (mdText.slice(start, start + 2) === "##" ||
        mdText.slice(start, start + 2) === "# ") &&
      mdText.slice(end - 1, end) === "}" &&
      end - start > 1
    ) {
      while (mdText[end] !== "{") {
        end--;
      }
      mdText.slice(start, start + 2) === "##"
        ? setCursorPosition(start + 3, end - 1)
        : setCursorPosition(start + 2, end - 1);
      let buttonName = getButtonName(end + 3);
      if (!segments.includes(buttonName)) return;
      setButtonValues((prevButtonValues) => ({
        ...prevButtonValues,
        ["sec_" + buttonName]: true,
      }));
    }

    //______

    if (
      mdText.slice(start - 1, start) === "*" &&
      mdText.slice(end, end + 1) === "*" &&
      mdText.slice(start - 2, start) !== "**" &&
      !buttonValues.italic
    ) {
      setButtonValues((prevButtonValues) => ({
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
    if (
      mdText.slice(start - 2, start) === "**" &&
      mdText.slice(end, end + 2) === "**"
    ) {
      setButtonValues((prevButtonValues) => ({
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
      setButtonValues((prevButtonValues) => ({
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

    //-------------
    if (
      mdText.slice(start, start + 3) === "```" &&
      mdText.slice(end - 3, end) === "```"
    ) {
      setButtonValues((prevButtonValues) => ({
        ...prevButtonValues,
        codeblock: true,
      }));
    }

    if (
      mdText.slice(start, start + 3) === "```" &&
      mdText.slice(end - 3, end) === "```" &&
      end - start > 1
    ) {
      setCursorPosition(start + 3 + course.length + 1, end - 3);
    }

    // ----------------

    if (
      mdText.slice(start - 1, start) === "`" &&
      mdText.slice(end, end + 1) === "`" &&
      mdText.slice(end, end + 2) !== "``" &&
      end - start > 1
    ) {
      if (mdText.slice(end, end + 11) === "`{.microbit") {
        let buttonName = getButtonName(end + 11);
        if (!buttonValues[buttonName]) {
          setButtonValues((prevButtonValues) => ({
            ...prevButtonValues,
            [buttonName]: true,
          }));

          return;
        }
      } else if (mdText.slice(end, end + 8) === "`{.block") {
        let buttonName = getButtonName(end + 8);
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

    //-------------------

    if (
      mdText.slice(start, start + 1) === "`" &&
      (mdText.slice(end - 1, end) === "}" ||
        mdText.slice(end - 1, end) === "`") &&
      mdText.slice(end - 2, end) !== "``" &&
      end - start > 1
    ) {
      let i = end;
      while (mdText[i] !== "`") {
        i--;
      }
      if (end - start > 1) {
        setCursorPosition(start + 1, i);
      }
      if (mdText.slice(i, i + 11) === "`{.microbit") {
        let buttonName = getButtonName(i + 11);
        if (!buttonValues[buttonName]) {
          setButtonValues((prevButtonValues) => ({
            ...prevButtonValues,
            [buttonName]: true,
          }));

          return;
        }
      } else if (mdText.slice(i, i + 8) === "`{.block") {
        let buttonName = getButtonName(i + 8);
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
