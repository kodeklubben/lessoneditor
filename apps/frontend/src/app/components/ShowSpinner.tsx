import { Loader, Modal } from "semantic-ui-react";

const ShowSpinner = () => {
  return (
    <Modal defaultOpen dimmer="inverted">
      <Loader />
    </Modal>
  );
};

export default ShowSpinner;
