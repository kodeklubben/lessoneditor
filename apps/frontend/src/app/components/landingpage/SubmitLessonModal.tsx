import { Button, Header, Modal } from "semantic-ui-react";
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
            <Header>Oppgaven er sendt inn til kodeklubben Lær Kidsa Koding</Header>
            <p>Din oppgave vil bli gjennomgått av Lær Kidsa Koding før den publiseres.</p>
          </Modal.Description>

          <p>
            Du kan følge{" "}
            <a href="https://github.com/kodeklubben/oppgaver/pulls" target="_blank">
              denne
            </a>{" "}
            linken for å sjekke at oppgaven kom helt frem.
          </p>
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
            <Modal.Header>Takk for ditt bidrag!</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <p>
                  Din oppgave vil bli gjennomgått før den publiseres på nettsiden til
                  <a
                    style={{ marginLeft: "1ch", color: "black" }}
                    href="https://oppgaver.kidsakoder.no"
                    target="_blank"
                  >
                    Lær Kidsa Koder.
                  </a>
                </p>
              </Modal.Description>
            </Modal.Content>

            <Modal.Content>
              <h4>
                Skriv gjerne en kommentar <span style={{ color: "grey" }}>(hvis du vil)</span>:
              </h4>

              <textarea
                style={{
                  width: "100%",
                  height: "10vh",
                  outline: "none",
                  borderColor: "grey",
                  borderRadius: "3px",
                  padding: "1em",
                }}
                name="textValue"
                onChange={handleChange}
                placeholder="...dette er en oppgave som handler om..."
              />
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
