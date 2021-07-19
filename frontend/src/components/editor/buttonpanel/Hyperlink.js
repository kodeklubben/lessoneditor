import React, { useState } from "react";
import ButtonComponent from "./ButtonComponent";
import { useHotkeys } from "react-hotkeys-hook";
import {
  hyperlink as config,
  KEY_COMBINATIONS as KEY,
} from "./settings/buttonConfig";

import {
  Button,
  Checkbox,
  Modal,
  Header,
  Input,
  Label,
} from "semantic-ui-react";

const languageNO = {
  insertLink: "Sett inn URL for din lenke",
  openNewWindow: "Åpne lenke i ny fane",
  ok: "OK",
  cancel: "Avbryt",
  linkText: "lenkebeskrivelse",
  mandatoryText: "Må fylle ut URL",
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
  const [url, setUrl] = useState("https://");
  const [openNewWindow, setOpenNewWindow] = useState(false);

  const isEmptyField = url === "https://" || url === "";

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
    <div>
      <ButtonComponent
        buttonValues={""}
        icon={config.hyperlink.icon}
        title={config.hyperlink.title}
        onButtonClick={handleButtonClick}
        buttonTitle={config.hyperlink.buttonTitle}
        shortcutKey={config.hyperlink.shortcut}
      />

      <Modal
        dimmer="inverted"
        onClose={() => setIsOpen(false)}
        onOpen={() => setIsOpen(true)}
        open={isOpen}
        size="mini"
        className="hyperlink_modal"
      >
        <Modal.Header className="hyperlink_modal">
          <Header as="h1">Sett inn lenke</Header>
        </Modal.Header>
        <Modal.Content className="hyperlink_modal">
          <Header as="h3">{languageNO.insertLink}</Header>
          <Label id="video_modal_label">
            URL
            <Input
              autoFocus
              type="text"
              name="linkUrl"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{ width: "100%" }}
              size="big"
              placeholder="URL"
            />
          </Label>
        </Modal.Content>
        <Modal.Content className="hyperlink_modal">
          <Checkbox
            checked={openNewWindow}
            onChange={() => setOpenNewWindow(!openNewWindow)}
            label={languageNO.openNewWindow}
          />
        </Modal.Content>

        <Modal.Actions className="hyperlink_modal">
          <Button
            onClick={clickCancelHandler}
            content={languageNO.cancel}
            color="black"
          />
          <Button
            disabled={isEmptyField}
            onClick={clickOKHandler}
            content={languageNO.ok}
            positive
            labelPosition="right"
            icon="checkmark"
          />
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default Hyperlink;
