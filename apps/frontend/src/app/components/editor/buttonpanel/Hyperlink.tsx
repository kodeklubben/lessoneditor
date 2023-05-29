import { FC, RefObject, useState } from "react";
import { RenderButtons } from "./buttoncontroller/views/RenderButtons";
import { useHotkeys } from "react-hotkeys-hook";
import {
  hyperlink as config,
  KEY_COMBINATIONS as KEY,
} from "./buttoncontroller/settings/buttonConfig";

import { Button, Checkbox, Header, Input, Modal } from "semantic-ui-react";

const languageNO = {
  header: "Sette inn lenke",
  insertLink: "Sett inn URL for din lenke",
  openNewWindow: "Åpne lenke i ny fane",
  ok: "OK",
  cancel: "Avbryt",
  linkText: "lenkebeskrivelse",
  mandatoryText: "Må fylle ut URL",
};

interface HyperlinkProps {
  editorRef: RefObject<HTMLTextAreaElement>;
  mdText: string;
  cursorPositionStart: number;
  cursorPositionEnd: number;
  setMdText: React.Dispatch<React.SetStateAction<string>>;
  setCursorPosition: (positionStart: number, positionEnd: number) => void;
  setCursor: (pos1: number, pos2: number) => void;
  setUndoAndUndoPosition: (mdText: string, position: number) => void;
}

const Hyperlink: FC<HyperlinkProps> = ({
  editorRef,
  mdText,
  cursorPositionStart,
  cursorPositionEnd,
  setMdText,
  setCursorPosition,
  setCursor,
  setUndoAndUndoPosition,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("https://");
  const [openNewWindow, setOpenNewWindow] = useState(false);

  const isEmptyField = url === "https://" || url === "";

  useHotkeys(
    KEY.hyperlink.hyperlink,
    (event) => {
      event.preventDefault();
      handleButtonClick();
    },
    {}
  );

  const handleButtonClick = () => {
    setUndoAndUndoPosition(mdText, cursorPositionStart);
    setIsOpen(!isOpen);
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
              `[${mdText.slice(cursorPositionStart, cursorPositionEnd)}](${url}){:target=_blank}` +
              mdText.slice(cursorPositionEnd)
          )
        : setMdText(
            mdText.slice(0, cursorPositionStart) +
              `[${mdText.slice(cursorPositionStart, cursorPositionEnd)}](${url})` +
              mdText.slice(cursorPositionEnd)
          );
    }

    setIsOpen(false);
    setOpenNewWindow(false);
    setUrl("https://");
    editorRef.current ? editorRef.current.focus() : "";
    setCursor(start, end);
    setCursorPosition(start, end);
  };

  const clickCancelHandler = () => {
    setIsOpen(false);
    setOpenNewWindow(false);
    setUrl("https://");
    editorRef.current ? editorRef.current.focus() : "";
  };

  return (
    <div className="hyperlink_button_group">
      <RenderButtons
        isON={false}
        icon={config.hyperlink.icon}
        title={config.hyperlink.title}
        handleButtonClick={handleButtonClick}
        buttonSlug={config.hyperlink.slug}
        shortcutKey={config.hyperlink.shortcut}
      />

      <Modal
        onClose={() => setIsOpen(false)}
        onOpen={() => setIsOpen(true)}
        closeIcon
        open={isOpen}
        size="small"
        className="hyperlink_modal"
      >
        <Modal.Header className="hyperlink_modal">
          <Header as="h1">{languageNO.header}</Header>
        </Modal.Header>
        <Modal.Content className="hyperlink_modal">
          <Header as="h3">{languageNO.insertLink}</Header>

          <Input
            fluid
            autoFocus
            icon="linkify"
            type="text"
            name="linkUrl"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            size="big"
            placeholder="URL"
          />
        </Modal.Content>
        <Modal.Content className="hyperlink_modal">
          <Checkbox
            checked={openNewWindow}
            onChange={() => setOpenNewWindow(!openNewWindow)}
            label={languageNO.openNewWindow}
          />
        </Modal.Content>

        <Modal.Actions className="hyperlink_modal">
          <Button onClick={clickCancelHandler} content={languageNO.cancel} color="black" />
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
