import { FC, useState, RefObject } from "react";
import { RenderButtons } from "./buttoncontroller/views/RenderButtons";
import { useHotkeys } from "react-hotkeys-hook";
import { KEY_COMBINATIONS as KEY, media as config } from "./buttoncontroller/settings/buttonConfig";

import { Button, Header, Input, Modal } from "semantic-ui-react";
import FieldError from "../../shared/FieldError";
import { getVideoId } from "../../../utils/mdParser";

const languageNO = {
  header: "Video",
  insertLink: "Sett inn URL til din video",
  ok: "OK",
  cancel: "Avbryt",
  mandatoryText: "Lim inn en lenke til en video på YouTube eller Vimeo.",
};

interface VideoProps {
  editorRef: RefObject<HTMLTextAreaElement | null>;
  mdText: string;
  cursorPositionStart: number;
  cursorPositionEnd: number;
  setMdText: React.Dispatch<React.SetStateAction<string>>;
  setCursorPosition: (positionStart: number, positionEnd: number) => void;
  setCursor: (pos1: number, pos2: number) => void;
  setUndoAndUndoPosition: (mdText: string, position: number) => void;
}

const Video: FC<VideoProps> = ({
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
  const [url, setUrl] = useState("");
  const [validateUrl, setValidateUrl] = useState("");

  const isEmptyField = url === "";

  // Same check as the preview, so a link that is accepted here also renders there.
  const video = getVideoId(url.trim());
  const isYoutube = video?.provider === "youtube";
  const isVimeo = video?.provider === "vimeo";

  useHotkeys(
    `${KEY.media.video}`,
    (event) => {
      event.preventDefault();
      handleButtonClick();
      return false;
    },
    { enableOnFormTags: ["TEXTAREA"], keydown: true },
  );

  const handleButtonClick = () => {
    setUndoAndUndoPosition(mdText, cursorPositionStart);
    setIsOpen(!isOpen);
    return;
  };

  const clickOKHandler = () => {
    if (!(isYoutube || isVimeo)) {
      setValidateUrl(languageNO.mandatoryText);
      return;
    }
    const end = cursorPositionEnd + url.length + 15;

    setMdText(
      mdText.slice(0, cursorPositionStart) +
        `:::${"video"}[${url.trim()}]
:::
` +
        mdText.slice(cursorPositionStart),
    );

    setIsOpen(false);
    setUrl("");
    setValidateUrl("");
    editorRef.current ? editorRef.current.focus() : "";
    setCursor(end, end);
    setCursorPosition(end, end);
  };

  const clickCancelHandler = () => {
    setIsOpen(false);
    setUrl("");
    setValidateUrl("");
    editorRef.current ? editorRef.current.focus() : "";
  };

  return (
    <div className="video_button_group">
      <RenderButtons
        isON={false}
        icon={config.video.icon}
        title={config.video.title}
        handleButtonClick={handleButtonClick}
        buttonSlug={config.video.slug}
        shortcutKey={config.video.shortcut}
      />

      <Modal
        onClose={() => clickCancelHandler()}
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
            icon={isYoutube ? "youtube" : isVimeo ? "vimeo" : "video"}
            style={isYoutube ? { color: "red" } : isVimeo ? { color: "blue" } : { color: "grey" }}
            autoFocus
            type="text"
            name="videoUrl"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            size="big"
            placeholder="Støtter YouTube og Vimeo"
          />

          <FieldError>{url && !video ? languageNO.mandatoryText : validateUrl}</FieldError>
        </Modal.Content>

        <Modal.Content className="hyperlink_modal"></Modal.Content>

        <Modal.Actions className="hyperlink_modal">
          <Button onClick={clickCancelHandler} content={languageNO.cancel} color="black" />
          <Button
            disabled={isEmptyField || !(isYoutube || isVimeo)}
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

export default Video;
