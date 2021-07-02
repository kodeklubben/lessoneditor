import React, { useState } from "react";
import ButtonComponent from "./ButtonComponent";
import { useHotkeys } from "react-hotkeys-hook";
import {
  video as config,
  KEY_COMBINATIONS as KEY,
} from "./settings/buttonConfig";

import { Button, Modal, Header, Input, Icon, Label } from "semantic-ui-react";

const languageNO = {
  header: "Sett inn videolenke",
  insertLink: "Sett inn URL til din video",
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
  const [url, setUrl] = useState("");
  const [contentProvider, setContentProvider] = useState("");

  const isEmptyField = url === "";

  console.log({ url });
  console.log(url.match(/^youtube\s*\[(.*)]$/));

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
      setMdText(
        mdText.slice(0, cursorPositionStart) +
          `:::${contentProvider}[${url}]
:::` +
          mdText.slice(cursorPositionStart)
      );
    } else {
      setMdText(
        mdText.slice(0, cursorPositionStart) +
          `[${mdText.slice(cursorPositionStart, cursorPositionEnd)}](${url})` +
          mdText.slice(cursorPositionEnd)
      );
    }

    setIsOpen(false);
    setUrl("");
    editorRef.current.focus();
    setCursor(start, end);
    setCursorPosition(start, end);
  };

  const clickCancelHandler = () => {
    setIsOpen(false);
    setUrl("");
    editorRef.current.focus();
  };

  return (
    <div>
      <ButtonComponent
        buttonValues={""}
        icon={config.video.icon}
        title={config.video.title}
        onButtonClick={handleButtonClick}
        buttonTitle={config.video.buttonTitle}
        shortcutKey={config.video.shortcut}
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
          <Header as="h1">{languageNO.header}</Header>
        </Modal.Header>

        <Modal.Content className="hyperlink_modal">
          <Header as="h3">{languageNO.insertLink}</Header>

          <Label id="video_modal_label">
            URL
            <Input
              autoFocus
              type="text"
              name="videoUrl"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{ width: "100%" }}
              size="big"
              placeholder="Støtter YouTube og Vimeo"
            />
            <div style={{ display: "flex", float: "right" }}>
              <Icon name="youtube" size="large" color="red" />
              <Icon name="vimeo" size="large" color="blue" />
            </div>
          </Label>
        </Modal.Content>

        <Modal.Content className="hyperlink_modal"></Modal.Content>

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
