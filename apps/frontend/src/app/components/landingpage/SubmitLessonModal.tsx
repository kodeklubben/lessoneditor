import { Button, Modal, Header, Form, TextArea, Label, Message } from "semantic-ui-react";
import { FC, useState } from "react";

import { paths } from "@lessoneditor/contracts";
import axios from "axios";
import { useNavigate } from "react-router";

const SubmitLessonModal: FC<any> = ({ openSubmitModal, setOpenSubmitModal, lessonId }) => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submitComment, addSubmitComment] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const onSubmit = async (lessonId: string) => {
    const submitMessage = { message: submitComment };
    try {
      setLoading(true);
      await axios.post(paths.LESSON_SUBMIT.replace(":lessonId", lessonId), submitMessage);
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

  const handleChange = (e: any) => {
    addSubmitComment(e.target.value);
  };

  const submitted = () => {
    return (
      <>
        <Modal.Header>Takk for ditt bidrag!</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Header>Oppgaven er sendt inn til kodeklubben KidsaKoder</Header>
            <Message>
              <p>Din oppgave vil bli gjennomgått av kidsakoder før den publiseres.</p>
              <p>
                Du kan følge <a href="https://github.com/kodeklubben/oppgaver/pulls">denne</a>{" "}
                linken for å sjekke at oppgaven kom helt frem.
              </p>
            </Message>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button
            content="Tilbake"
            labelPosition="right"
            icon="checkmark"
            color="black"
            onClick={() => navigate("/")}
          />
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
            <Modal.Content>
              <h3>Takk for at du bidrar med oppgaver til kodeklubben Lær Kidsa Koding!</h3>
              <Message>
                <p>
                  Din oppgave vil bli gjennomgått før den publiseres på nettsiden til
                  <a
                    style={{ marginLeft: "1ch", color: "black" }}
                    href="https://oppgaver.kidsakoder.no"
                  >
                    Lær Kidsa Koder.
                  </a>
                </p>

                <h4>Om oppgaven :</h4>

                <textarea
                  style={{ width: "100%", height: "10vh", border: "none", outline: "none" }}
                  name="textValue"
                  onChange={handleChange}
                  placeholder="...dette er en oppgave som handler om..."
                />
              </Message>
            </Modal.Content>

            <Modal.Actions>
              <>
                <Button disabled={loading} color="black" onClick={() => setOpenSubmitModal(false)}>
                  Avbryt
                </Button>
                <Button
                  content="Fortsett"
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
