import { FC, useState } from "react";
import { Link } from "react-router";
import { Button, Header, Message, Modal } from "semantic-ui-react";

/** Copies text for the user to keep; false when the browser does not allow it. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

interface Props {
  problem: "conflict" | "missing" | undefined;
  lessonId: string;
  /** The text in this editor, which is not saved. */
  text: string;
  keepMine: () => Promise<unknown>;
  takeTheirs: () => Promise<unknown>;
}

/**
 * Shown when the editor cannot save and trying again will not help: the text was saved elsewhere
 * meanwhile (another tab, a co-author), or it was deleted. The user decides what happens to what
 * they wrote; nothing is replaced or thrown away without asking.
 */
const SaveProblemModal: FC<Props> = ({ problem, lessonId, text, keepMine, takeTheirs }) => {
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState<boolean | undefined>(undefined);
  // After taking the other version: says where the user's own text went, until they close it.
  const [switched, setSwitched] = useState(false);

  const copyNotice =
    copied === true ? (
      <Message
        positive
        size="small"
        content="Teksten din er kopiert. Lim den inn der du vil ha den."
      />
    ) : copied === false ? (
      <Message
        warning
        size="small"
        content="Nettleseren lot oss ikke kopiere. Marker teksten i editoren og kopier den selv."
      />
    ) : null;

  if (problem === "missing") {
    return (
      <Modal open size="tiny" dimmer="inverted" closeOnDimmerClick={false}>
        <Modal.Content>
          <Header as="h2" size="medium">
            Teksten finnes ikke lenger
          </Header>
          <p>
            Den er slettet, kanskje i en annen fane. Det du har skrevet her, er ikke lagret. Kopier
            det før du går videre.
          </p>
          {copyNotice}
        </Modal.Content>
        <Modal.Actions>
          <Button as={Link} to={`/landingpage/${lessonId}`} basic content="Til oppgaven" />
          <Button
            positive
            icon="copy outline"
            labelPosition="left"
            content="Kopier teksten"
            onClick={async () => setCopied(await copyText(text))}
          />
        </Modal.Actions>
      </Modal>
    );
  }

  if (switched) {
    return (
      <Modal open size="tiny" dimmer="inverted" onClose={() => setSwitched(false)}>
        <Modal.Content>
          <Header as="h2" size="medium">
            Den andre versjonen vises nå
          </Header>
          {copied ? (
            <p>Teksten du skrev, er kopiert. Lim den inn der du vil ha den.</p>
          ) : (
            <p>Nettleseren lot oss ikke kopiere teksten din, og den er erstattet.</p>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button positive content="OK" onClick={() => setSwitched(false)} />
        </Modal.Actions>
      </Modal>
    );
  }

  return (
    <Modal open={problem === "conflict"} size="tiny" dimmer="inverted" closeOnDimmerClick={false}>
      <Modal.Content>
        <Header as="h2" size="medium">
          Teksten er endret et annet sted
        </Header>
        <p>
          Mens du skrev, ble en annen versjon lagret, i en annen fane eller av en du deler oppgaven
          med. Velg hvilken versjon som skal gjelde.
        </p>
        <p style={{ color: "#5c6166" }}>
          Velger du den andre versjonen, kopieres teksten din først, så du kan lime den inn igjen.
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button
          basic
          disabled={busy}
          content="Bruk den andre versjonen"
          onClick={async () => {
            setBusy(true);
            setCopied(await copyText(text));
            try {
              await takeTheirs();
              setSwitched(true);
            } finally {
              setBusy(false);
            }
          }}
        />
        <Button
          positive
          loading={busy}
          disabled={busy}
          content="Behold min tekst"
          onClick={async () => {
            setBusy(true);
            try {
              await keepMine();
            } finally {
              setBusy(false);
            }
          }}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default SaveProblemModal;
