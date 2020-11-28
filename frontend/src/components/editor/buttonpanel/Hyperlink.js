import React, { useState } from "react";
import CPButton from "./ButtonComponent";
import { useHotkeys } from "react-hotkeys-hook";
import {
  KEY_COMBINATIONS as KEY,
  hyperlink as config,
} from "./settings/buttonConfig";

const languageNO = {
  insertLink: "Sett inn URL for din link",
  openNewWindow: "Åpne link i ny fane",
  ok: "OK",
  cancel: "Avbryt",
  linkText: "linkbeskrivelse",
};

const Popup = ({
  setIsOpen,
  mdText,
  setMdText,
  cursorPositionStart,
  cursorPositionEnd,
  setCursor,
  setCursorPosition,
  displayStyleValue,
  editorRef,
}) => {
  const [openNewWindow, setOpenNewWindow] = useState(false);
  const [url, setUrl] = useState("https://");

  const clickOKHandler = () => {
    const start = cursorPositionStart + 1;
    const end =
      cursorPositionStart === cursorPositionEnd
        ? cursorPositionEnd + languageNO.linkText.length + 1
        : cursorPositionStart + (cursorPositionEnd - cursorPositionStart + 1);

    if (cursorPositionStart === cursorPositionEnd) {
      openNewWindow
        ? setMdText(
            mdText.slice(0, cursorPositionStart) +
              `[${languageNO.linkText}](${url}){target=_blank}` +
              mdText.slice(cursorPositionStart)
          )
        : setMdText(
            mdText.slice(0, cursorPositionStart) +
              `[${languageNO.linkText}](${url})` +
              mdText.slice(cursorPositionStart)
          );
    } else {
      openNewWindow
        ? setMdText(
            mdText.slice(0, cursorPositionStart) +
              `[${mdText.slice(
                cursorPositionStart,
                cursorPositionEnd
              )}](${url}){target=_blank}` +
              mdText.slice(cursorPositionEnd)
          )
        : setMdText(
            mdText.slice(0, cursorPositionStart) +
              `[${mdText.slice(
                cursorPositionStart,
                cursorPositionEnd
              )}](${url})` +
              mdText.slice(cursorPositionEnd)
          );
    }

    setIsOpen(false);
    setOpenNewWindow(false);
    setUrl("https://");
    editorRef.current.focus();
    setCursor(start, end);
    setCursorPosition(start, end);
  };

  const clickCancelHandler = () => {
    setIsOpen(false);
    setOpenNewWindow(false);
    setUrl("https://");
    editorRef.current.focus();
  };

  return (
    <div
      style={{
        display: displayStyleValue,
        position: "absolute",
        top: "0%",
        left: "0%",
        zIndex: "1",
        width: "100%",
        height: "100%",
        backgroundColor: "rgb(256,256,256,0.7)",
      }}
    >
      <div
        style={{
          zIndex: "2",
          margin: "auto",
          marginTop: "10%",
          backgroundColor: "white",
          border: "1px solid black",
          borderRadius: "10px",
          padding: "7% 10%",
          width: "50%",
          height: "50%",
          boxShadow: "0px 0px 5px",
        }}
        className="ui form"
      >
        <div className="field">
          <label>{languageNO.insertLink}</label>
          <input
            type="text"
            name="linkUrl"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="URL"
          />
        </div>

        <div className="field">
          <div className="ui checkbox">
            <input
              type="checkbox"
              checked={openNewWindow}
              onChange={() => setOpenNewWindow(!openNewWindow)}
            />
            <label>{languageNO.openNewWindow}</label>
          </div>
        </div>
        <button
          disabled={url === "https://"}
          className="ui button"
          onClick={clickOKHandler}
        >
          {languageNO.ok}
        </button>
        <button className="ui button" onClick={clickCancelHandler}>
          {languageNO.cancel}
        </button>
      </div>
    </div>
  );
};

const Hyperlink = ({
  editorRef,
  mdText,
  cursorPositionStart,
  cursorPositionEnd,
  setMdText,
  setCursorPosition,
  setCursor,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useHotkeys(
    `${KEY.hyperlink}`,
    (event) => {
      event.preventDefault();

      handleButtonClick();

      return false;
    },
    { enableOnTags: "TEXTAREA", keydown: true }
  );

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
    return;
  };

  return (
    <>
      {Object.entries(config).map((element, index) => (
        <CPButton
          key={"element" + index}
          buttonValues={""}
          icon={element[1].icon}
          title={element[1].title}
          onButtonClick={handleButtonClick}
          buttonTitle={element[1].buttonTitle}
          shortcutKey={element[1].shortcut}
        />
      ))}

      <Popup
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        mdText={mdText}
        setMdText={setMdText}
        cursorPositionStart={cursorPositionStart}
        cursorPositionEnd={cursorPositionEnd}
        setCursor={setCursor}
        setCursorPosition={setCursorPosition}
        editorRef={editorRef}
        displayStyleValue={isOpen ? "block" : "none"}
      />
    </>
  );
};

export default Hyperlink;
