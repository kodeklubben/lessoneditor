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
  mandatoryText: "Må være gyldig lenke til youtube eller vimeo",
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
  const [validateUrl, setValidateUrl] = useState("");

  const isEmptyField = url === "";

  const isYoutube = url.match(
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\?v=)([^#&?]*).*/
  );

  const isVimeo = url.match(
    /^(http:\/\/|https:\/\/)?(www\.)?(vimeo\.com\/)([0-9]+)$/
  );

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
    let contentProvider = "";
    if (isYoutube) {
      contentProvider = "youtube";
    } else if (isVimeo) {
      contentProvider = "vimeo";
    } else {
      setValidateUrl(languageNO.mandatoryText);
      return;
    }
    const end = cursorPositionEnd + contentProvider.length + url.length + 10;

    setMdText(
      mdText.slice(0, cursorPositionStart) +
        `:::${contentProvider}[${url}]
:::
` +
        mdText.slice(cursorPositionStart)
    );

    setIsOpen(false);
    setUrl("");
    setValidateUrl("");
    editorRef.current.focus();
    setCursor(end, end);
    setCursorPosition(end, end);
  };

  const clickCancelHandler = () => {
    setIsOpen(false);
    setUrl("");
    setValidateUrl("");
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
            <div style={{ display: "flex", float: "left" }}>
              <Icon name="youtube" size="large" color="red" />
              <Icon name="vimeo" size="large" color="blue" />
            </div>
            <Input
              autoFocus
              type="text"
              name="videoUrl"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{ width: "100%" }}
              size="big"
              placeholder="Støtter YouTube og Vimeo"
            ></Input>
            <p style={{ color: "red" }}>{validateUrl}</p>
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
