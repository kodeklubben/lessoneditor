import { Button, Modal, Header } from "semantic-ui-react";
import { FC, useState } from "react";

import { paths } from "@lessoneditor/contracts";
import axios from "axios";

const SubmitLessonModal: FC<any> = ({ openSubmitModal, setOpenSubmitModal, lessonId }) => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (lessonId: string) => {
    try {
      setLoading(true);
      await axios.post(paths.LESSON_SUBMIT.replace(":lessonId", lessonId));
      setIsSubmitted(true);
      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  const onClose = () => {
    setIsSubmitted(false);
    setLoading(false);
    setOpenSubmitModal(false);
  };

  const submitted = () => {
    return (
      <>
        <Modal.Header>Takk for ditt bidrag!</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Header>Oppgaven er sendt inn til kodeklubben KidsaKoder</Header>
            <p>Din oppgave vil bli gjennomgått av kidsakoder før den publiseres.</p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button
            content="Ok"
            labelPosition="right"
            icon="checkmark"
            onClick={() => onClose()}
            positive
          />
        </Modal.Actions>
      </>
    );
  };

  return (
    <>
      <Modal
        onClose={() => onClose()}
        onOpen={() => setOpenSubmitModal(true)}
        open={openSubmitModal}
        closeOnDimmerClick={!loading}
        dimmer={"inverted"}
      >
        {isSubmitted ? (
          submitted()
        ) : (
          <>
            <Modal.Header>Sende inn oppgave</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <Header>Sende inn oppgave til Kodeklubben KidsaKoder?</Header>
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <>
                <Button disabled={loading} color="black" onClick={() => setOpenSubmitModal(false)}>
                  Nei
                </Button>
                <Button
                  content="Ja"
                  labelPosition="right"
                  icon="checkmark"
                  onClick={() => onSubmit(lessonId)}
                  positive
                  loading={loading}
                />
              </>
            </Modal.Actions>
          </>
        )}
      </Modal>
    </>
  );
};

export default SubmitLessonModal;
