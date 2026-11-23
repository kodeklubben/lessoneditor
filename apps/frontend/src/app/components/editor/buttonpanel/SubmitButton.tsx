import { Button, Header, Modal, Popup } from "semantic-ui-react";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { FC, useState } from "react";

interface SubmitButtonProps {
  mdText: string;
  flushAutosave: () => Promise<boolean>;
}

const SubmitButton: FC<SubmitButtonProps> = ({ mdText, flushAutosave }) => {
  const navigate = useNavigate();
  const { lessonId } = useParams<any>();
  const [saving, setSaving] = useState(false);
  const [unsaved, setUnsaved] = useState(false);
  const leave = () => navigate(["/landingpage", lessonId].join("/"));

  // Saves what is not saved yet before leaving, instead of dropping the last seconds (K4). If
  // that fails, asks in the app's own dialog; the browser's confirm() blocked the whole tab.
  const navigateToHome = async () => {
    setSaving(true);
    const saved = await flushAutosave();
    setSaving(false);
    if (saved) leave();
    else setUnsaved(true);
  };

  return (
    <div className="submit-button_button_group">
      <Modal open={unsaved} size="tiny" dimmer="inverted" onClose={() => setUnsaved(false)}>
        <Modal.Content>
          <Header as="h2" size="medium">
            Endringene er ikke lagret
          </Header>
          <p>Det siste du skrev, kom ikke fram. Går du nå, forsvinner det.</p>
        </Modal.Content>
        <Modal.Actions>
          <Button basic negative content="Gå uten å lagre" onClick={leave} />
          <Button positive content="Bli her" onClick={() => setUnsaved(false)} />
        </Modal.Actions>
      </Modal>
      <Popup
        content={"Til prosjektoversikt"}
        mouseEnterDelay={250}
        mouseLeaveDelay={250}
        trigger={
          <Button
            style={{
              height: "3rem",
              marginRight: "0",
              padding: "0 1em 0 1em",
            }}
            basic
            aria-label="Til prosjektoversikt"
            disabled={!mdText || mdText.length === 0 || saving}
            loading={saving}
            size="big"
            onClick={navigateToHome}
            icon="home"
          />
        }
      />
    </div>
  );
};

export default SubmitButton;
