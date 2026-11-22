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
 * Asks before deleting, waits for deleteContent and closes only when it succeeded; a failure is
 * shown in the dialog instead of leaving a spinner that never stops.
 */
const DeleteModal: FC<{
  setOpenDeleteContent: React.Dispatch<React.SetStateAction<boolean>>;
  openDeleteContent: boolean;
  deleteContent: () => Promise<unknown>;
}> = ({ openDeleteContent, setOpenDeleteContent, deleteContent }) => {
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
      closeOnDimmerClick={!loading}
    >
      <Modal.Content>
        <Modal.Description>
          <Header>Vil du slette innhold?</Header>
        </Modal.Description>
      </Modal.Content>
      {error && (
        <Modal.Content>
          <Message negative role="alert">
            {error}
          </Message>
        </Modal.Content>
      )}
      <Modal.Actions>
        <Button disabled={loading} onClick={() => setOpenDeleteContent(false)} color="black">
          Nei
        </Button>
        <Button
          content="Ja"
          labelPosition="right"
          icon="checkmark"
          onClick={onConfirm}
          positive
          loading={loading}
          disabled={loading}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default DeleteModal;
