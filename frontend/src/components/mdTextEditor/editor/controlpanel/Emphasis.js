import React, { useState } from "react";
import CPButton from "./CPButton";

import editorButtonsValue from "../editorButtonsValue";

import { emphasis as config } from "../../settingsFiles/buttonConfig";

let output;
let cancelResults;
let results;

const Emphasis = ({
  editorRef,
  cursorPositionStart,
  cursorPositionEnd,
  mdText,
  setMdText,
  setCursorPosition,
  setCursor,
}) => {
  const [isButtonOn, setButton] = useState(editorButtonsValue);

  const setChanges = (mdText, cursorPositionStart, cursorPositionEnd) => {
    setCursor(cursorPositionStart, cursorPositionEnd);
    setCursorPosition(cursorPositionStart, cursorPositionEnd);
    setMdText(mdText);
  };

  console.log(
    "cursorPositionStart :" +
      cursorPositionStart +
      "\ncursorPositionEnd : " +
      cursorPositionEnd
  );

  const cancelButton = (
    isOn,
    mdText,
    cursorPositionStart,
    cursorPositionEnd,
    cursorIntON,
    output
  ) => {
    if (
      isOn &&
      mdText.slice(
        cursorPositionStart - cursorIntON,
        cursorPositionStart - cursorIntON + output.length
      ) === output
    ) {
      mdText =
        mdText.slice(0, cursorPositionStart - cursorIntON) +
        mdText.slice(cursorPositionStart - cursorIntON + output.length);
      cursorPositionEnd = cursorPositionStart -= cursorIntON;
      return {
        cancel: true,
        mdText,
        cursorPositionStart,
        cursorPositionEnd,
      };
    } else {
      return {
        cancel: false,
        mdText,
        cursorPositionStart,
        cursorPositionEnd,
      };
    }
  };

  const emphasisButton = (
    isOn,
    mdText,
    cursorPositionStart,
    cursorPositionEnd,
    cursorIntON,
    cursorIntOFF,
    output
  ) => {
    if (!isOn) {
      if (cursorPositionStart !== cursorPositionEnd) {
        let i = mdText.slice(cursorPositionStart, cursorPositionEnd);
        while (
          i[0] === " " ||
          i[i.length - 1] === " " ||
          i[0] === "\n" ||
          i[i.length - 1] === "\n"
        ) {
          if (i[0] === " " || i[0] === "\n") {
            i = i.slice(1);
            cursorPositionStart += 1;
          }
          if (i[i.length - 1] === " " || i[i.length - 1] === "\n") {
            i = i.slice(0, i.length - 1);
            cursorPositionEnd -= 1;
          }
        }
        mdText =
          mdText.slice(0, cursorPositionStart) +
          output.slice(0, cursorIntON) +
          i +
          output.slice(cursorIntON) +
          mdText.slice(cursorPositionEnd);

        cursorPositionStart += cursorIntON;
        cursorPositionEnd += cursorIntON;

        return { mdText, cursorPositionStart, cursorPositionEnd };
      }
      mdText =
        mdText.slice(0, cursorPositionStart) +
        output +
        mdText.slice(cursorPositionStart);

      cursorPositionStart += cursorIntON;
      cursorPositionEnd += cursorIntON;
      return {
        mdText,
        cursorPositionStart,
        cursorPositionEnd,
      };
    } else if (isOn) {
      if (cursorPositionStart !== cursorPositionEnd) {
        mdText =
          mdText.slice(0, cursorPositionStart - cursorIntON) +
          mdText.slice(cursorPositionStart, cursorPositionEnd) +
          mdText.slice(cursorPositionEnd + cursorIntON);

        cursorPositionStart -= cursorIntON;
        cursorPositionEnd -= cursorIntON;

        return { mdText, cursorPositionStart, cursorPositionEnd };
      }
      cursorPositionStart += cursorIntOFF;
      cursorPositionEnd += cursorIntOFF;

      return { mdText, cursorPositionStart, cursorPositionEnd };
    }
  };

  const heading = (isOn, mdText, cursorPositionStart, output) => {
    if (
      output === "## " &&
      mdText.slice(cursorPositionStart - 3, cursorPositionStart) === output &&
      !isOn
    ) {
      isOn = !isOn;
      mdText =
        mdText.slice(0, cursorPositionStart - 3) +
        "# " +
        mdText.slice(cursorPositionStart);
      setMdText(mdText);
      cursorPositionStart -= 1;
      setCursorPosition(cursorPositionStart, cursorPositionStart);
      return { isOn, mdText, cursorPositionStart };
    } else if (output === "## " && !isOn) {
      mdText =
        mdText.slice(0, cursorPositionStart) +
        output +
        mdText.slice(cursorPositionStart);
      setMdText(mdText);
      cursorPositionStart += output.length;
      setCursorPosition(cursorPositionStart, cursorPositionStart);
      return { isOn, mdText, cursorPositionStart };
    } else if (output === "## " && isOn) {
      if (mdText.slice(cursorPositionStart - 2, cursorPositionStart) === "# ") {
        mdText =
          mdText.slice(0, cursorPositionStart - 2) +
          mdText.slice(cursorPositionStart);
        setMdText(mdText);
        cursorPositionStart -= 2;
        setCursorPosition(cursorPositionStart, cursorPositionStart);
        isOn = !isOn;
        return { isOn, mdText, cursorPositionStart };
      } else {
        isOn = !isOn;
        return { isOn, mdText, cursorPositionStart };
      }
    } else {
      return { isOn, mdText, cursorPositionStart };
    }
  };

  const setEmphasis = (button, cursorIntON, cursorIntOFF, output) => {
    cancelResults = cancelButton(
      isButtonOn[button],
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

    results = emphasisButton(
      isButtonOn[button],
      mdText,
      cursorPositionStart,
      cursorPositionEnd,
      cursorIntON,
      cursorIntOFF,
      output
    );

    setChanges(
      results.mdText,
      results.cursorPositionStart,
      results.cursorPositionEnd
    );
  };

  const newHandleButtonClick = (button) => {
    editorRef.current.focus();
    setButton((prevState) => ({ ...prevState, [button]: !isButtonOn[button] }));
    switch (button) {
      case "bold":
        setEmphasis(button, 2, 2, "****");
        break;
      case "italic":
        setEmphasis(button, 1, 1, "**");
        break;
      case "heading":
        output = "## ";

        results = heading(
          isButtonOn[button],
          mdText,
          cursorPositionStart,
          output
        );
        setButton((prevState) => ({ ...prevState, [button]: results.isOn }));
        setChanges(
          results.mdText,
          results.cursorPositionStart,
          results.cursorPositionStart
        );

        break;

      case "strikethrough":
        setEmphasis(button, 2, 2, "~~~~");
        break;
      default:
        alert("default");
    }
  };
  return (
    <>
      <div className="ui icon buttons emphasis">
        {config.map((element, index) => (
          <CPButton
            key={"element" + index}
            buttonTitle={element.buttonTitle}
            icon={element.icon}
            title={element.title}
            onButtonClick={newHandleButtonClick}
            shortcutKey={element.shortcut}
          />
        ))}
      </div>
    </>
  );
};

export default Emphasis;
