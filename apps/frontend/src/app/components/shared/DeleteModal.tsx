import React, { FC, useState } from "react";
import { Modal, Button, Header } from "semantic-ui-react";
import { useUserContext } from "../../contexts/UserContext";

const DeleteModal: FC<{
  setOpenDeleteContent: React.Dispatch<React.SetStateAction<boolean>>;
  openDeleteContent: boolean;
  loading: boolean;
  deleteContent: () => void;
}> = ({ openDeleteContent, setOpenDeleteContent, deleteContent, loading }) => {
  return (
    <Modal
      onClose={() => setOpenDeleteContent(false)}
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
      <Modal.Actions>
        <Button disabled={loading} onClick={() => setOpenDeleteContent(false)}>
          Nei
        </Button>
        <Button
          content="Ja"
          labelPosition="right"
          icon="checkmark"
          onClick={deleteContent}
          positive
          loading={loading}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default DeleteModal;
