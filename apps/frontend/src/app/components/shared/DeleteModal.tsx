import React, { FC, useState } from "react";
import { Modal, Button, Header, Message } from "semantic-ui-react";

/** The server's message for a refused delete (e.g. the last lesson text), otherwise a general one. */
export function deleteErrorMessage(error: unknown): string {
  const response = (error as { response?: { status?: number; data?: { message?: unknown } } })
    ?.response;
  return typeof response?.data?.message === "string" && (response.status ?? 500) < 500
    ? response.data.message
    : "Kunne ikke slette. Prøv igjen.";
}

/**
 * Asks before deleting, naming what goes, waits for deleteContent and closes only when it
 * succeeded; a failure is shown in the dialog instead of leaving a spinner that never stops.
 */
const DeleteModal: FC<{
  setOpenDeleteContent: React.Dispatch<React.SetStateAction<boolean>>;
  openDeleteContent: boolean;
  deleteContent: () => Promise<unknown>;
  /** What is deleted, as it ends the question: «Slette oppgaveteksten på nynorsk?». */
  what: string;
  /** What else goes with it; the dialog always says it cannot be undone. */
  detail?: string;
}> = ({ openDeleteContent, setOpenDeleteContent, deleteContent, what, detail }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onConfirm = async () => {
    setLoading(true);
    setError("");
    try {
      await deleteContent();
      setOpenDeleteContent(false);
    } catch (e) {
      setError(deleteErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      onClose={() => !loading && setOpenDeleteContent(false)}
      onOpen={() => setOpenDeleteContent(true)}
      open={openDeleteContent}
      dimmer="inverted"
      size="tiny"
      closeOnDimmerClick={!loading}
    >
      <Modal.Content>
        <Header as="h2" size="medium">
          Slette {what}?
        </Header>
        <p>{detail ? `${detail} ` : ""}Det kan ikke angres.</p>
        {error && (
          <Message negative role="alert">
            {error}
          </Message>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button basic disabled={loading} onClick={() => setOpenDeleteContent(false)}>
          Avbryt
        </Button>
        <Button
          content="Slett"
          labelPosition="left"
          icon="trash alternate outline"
          onClick={onConfirm}
          negative
          loading={loading}
          disabled={loading}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default DeleteModal;
