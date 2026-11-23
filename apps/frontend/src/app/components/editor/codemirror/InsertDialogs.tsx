import { FC, useState } from "react";
import { Button, Checkbox, Header, Input, Modal } from "semantic-ui-react";
import FieldError from "../../shared/FieldError";
import { getVideoId } from "../../../utils/mdParser";

/** The link dialog of the classic editor (Hyperlink), without its own text handling. */
export const LinkDialog: FC<{
  open: boolean;
  onClose: () => void;
  onInsert: (url: string, newTab: boolean) => void;
}> = ({ open, onClose, onInsert }) => {
  const [url, setUrl] = useState("https://");
  const [newTab, setNewTab] = useState(false);
  const empty = url.trim() === "" || url.trim() === "https://";

  const close = () => {
    setUrl("https://");
    setNewTab(false);
    onClose();
  };
  const insert = () => {
    if (empty) return;
    onInsert(url.trim(), newTab);
    close();
  };

  return (
    <Modal onClose={close} closeIcon open={open} size="small" className="hyperlink_modal">
      <Modal.Header className="hyperlink_modal">
        <Header as="h1">Sette inn lenke</Header>
      </Modal.Header>
      <Modal.Content className="hyperlink_modal">
        <Header as="h3">Sett inn URL for din lenke</Header>
        <Input
          fluid
          autoFocus
          icon="linkify"
          type="text"
          name="linkUrl"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          onKeyDown={(event: React.KeyboardEvent) => {
            // The Enter must not reach the editor, which gets the focus back as the dialog closes.
            if (event.key !== "Enter") return;
            event.preventDefault();
            insert();
          }}
          size="big"
          placeholder="URL"
        />
      </Modal.Content>
      <Modal.Content className="hyperlink_modal">
        <Checkbox
          checked={newTab}
          onChange={() => setNewTab(!newTab)}
          label="Åpne lenke i ny fane"
        />
      </Modal.Content>
      <Modal.Actions className="hyperlink_modal">
        <Button onClick={close} content="Avbryt" color="black" />
        <Button
          disabled={empty}
          onClick={insert}
          content="OK"
          positive
          labelPosition="right"
          icon="checkmark"
        />
      </Modal.Actions>
    </Modal>
  );
};

/** The video dialog of the classic editor (Video): YouTube and Vimeo only, as the preview. */
export const VideoDialog: FC<{
  open: boolean;
  onClose: () => void;
  onInsert: (url: string) => void;
}> = ({ open, onClose, onInsert }) => {
  const [url, setUrl] = useState("");
  const video = getVideoId(url.trim());

  const close = () => {
    setUrl("");
    onClose();
  };
  const insert = () => {
    if (!video) return;
    onInsert(url.trim());
    close();
  };

  return (
    <Modal onClose={close} closeIcon open={open} size="small" className="hyperlink_modal">
      <Modal.Header className="hyperlink_modal">
        <Header as="h1">Video</Header>
      </Modal.Header>
      <Modal.Content className="hyperlink_modal">
        <Header as="h3">Sett inn URL til din video</Header>
        <Input
          fluid
          autoFocus
          icon={
            video?.provider === "youtube"
              ? "youtube"
              : video?.provider === "vimeo"
                ? "vimeo"
                : "video"
          }
          style={{
            color:
              video?.provider === "youtube" ? "red" : video?.provider === "vimeo" ? "blue" : "grey",
          }}
          type="text"
          name="videoUrl"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          onKeyDown={(event: React.KeyboardEvent) => {
            // The Enter must not reach the editor, which gets the focus back as the dialog closes.
            if (event.key !== "Enter") return;
            event.preventDefault();
            insert();
          }}
          size="big"
          placeholder="Støtter YouTube og Vimeo"
        />
        <FieldError>
          {url && !video ? "Lim inn en lenke til en video på YouTube eller Vimeo." : ""}
        </FieldError>
      </Modal.Content>
      <Modal.Actions className="hyperlink_modal">
        <Button onClick={close} content="Avbryt" color="black" />
        <Button
          disabled={!video}
          onClick={insert}
          content="OK"
          positive
          labelPosition="right"
          icon="checkmark"
        />
      </Modal.Actions>
    </Modal>
  );
};
