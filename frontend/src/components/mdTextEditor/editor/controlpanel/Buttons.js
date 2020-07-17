import React, { useState } from "react";
import CPButton from "./CPButton";

import editorButtonsValue from "../editorButtonsValue";

import { emphasis } from "../../settingsFiles/buttonConfig";

let cursorIntON;
let cursorIntOFF;
let output;
let cancelResults;
let results;

const Buttons = ({
  editorRef,
  cursorPositionStart,
  cursorPositionEnd,
  mdText,
  setMdText,
  setCursorPosition,
  setCursor,
}) => {
  let [isButtonOn, setButton] = useState(editorButtonsValue);

  const setChanges = (mdText, cursorPositionStart, cursorPositionEnd) => {
    setCursor(cursorPositionStart, cursorPositionEnd);
    setCursorPosition(cursorPositionStart, cursorPositionEnd);
    setMdText(mdText);
  };

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

  const newHandleButtonClick = (button) => {
    editorRef.current.focus();
    setButton((prevState) => ({ ...prevState, [button]: !isButtonOn[button] }));
    switch (button) {
      case "bold":
        cursorIntON = emphasis[0].cursorIntON;
        cursorIntOFF = emphasis[0].cursorIntOFF;
        output = emphasis[0].output;

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
          break;
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
        break;
      case "italic":
        cursorIntON = emphasis[1].cursorIntON;
        cursorIntOFF = emphasis[1].cursorIntOFF;
        output = emphasis[1].output;

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
          break;
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
        break;
      case "heading":
        cursorIntON = emphasis[2].cursorIntON;
        cursorIntOFF = emphasis[2].cursorIntOFF;
        output = emphasis[2].output;

        results = heading(
          isButtonOn[button],
          mdText,
          cursorPositionStart,
          output
        );
        console.log(results);
        setButton((prevState) => ({ ...prevState, [button]: results.isOn }));
        setChanges(
          results.mdText,
          results.cursorPositionStart,
          results.cursorPositionStart
        );

        break;

      case "strikethrough":
        cursorIntON = emphasis[3].cursorIntON;
        cursorIntOFF = emphasis[3].cursorIntOFF;
        output = emphasis[3].output;

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
          break;
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
        break;
      default:
        alert("default");
    }
  };
  return (
    <>
      <div className="ui icon buttons emphasis">
        {emphasis.map((element, index) => (
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

export { Buttons };
