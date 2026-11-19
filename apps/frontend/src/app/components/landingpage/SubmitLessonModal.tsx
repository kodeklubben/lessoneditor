import { Button, Modal, Header } from "semantic-ui-react";
import { FC, useState } from "react";

import { paths } from "@lessoneditor/contracts";
import axios from "axios";
import { submitErrorMessage } from "./utils/submitError";
import { useNavigate } from "react-router";

const SubmitLessonModal: FC<any> = ({ openSubmitModal, setOpenSubmitModal, lessonId }) => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submitComment, addSubmitComment] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [pullRequestUrl, setPullRequestUrl] = useState<string | null>(null);

  const navigate = useNavigate();

  const onSubmit = async (lessonId: string) => {
    const submitMessage = { message: submitComment };
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post<{ url?: string | null }>(
        paths.LESSON_SUBMIT.replace(":lessonId", lessonId),
        submitMessage
      );
      setPullRequestUrl(data?.url ?? null);
      setIsSubmitted(true);
    } catch (e) {
      console.error(e);
      setError(submitErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => {
    setIsSubmitted(false);
    setLoading(false);
    setError("");
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
            <a
              href={pullRequestUrl ?? "https://github.com/kodeklubben/oppgaver/pulls"}
              target="_blank"
              rel="noopener noreferrer"
            >
              denne lenken
            </a>{" "}
            for å sjekke at oppgaven kom helt frem.
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
                    Lær Kidsa Koding.
                  </a>
                </p>
              </Modal.Description>
            </Modal.Content>

            <Modal.Content>
              <label htmlFor="submit-comment" style={{ fontWeight: 700, display: "block" }}>
                Skriv gjerne en kommentar <span style={{ color: "#595959" }}>(hvis du vil)</span>:
              </label>

              <textarea
                style={{
                  width: "100%",
                  height: "10vh",
                  borderColor: "grey",
                  borderRadius: "3px",
                  padding: "1em",
                }}
                id="submit-comment"
                name="textValue"
                onChange={handleChange}
                placeholder="...dette er en oppgave som handler om..."
              />
              {error && (
                <p role="alert" style={{ color: "#9f3a38", marginTop: "1em" }}>
                  {error}
                </p>
              )}
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
                  disabled={loading}
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
