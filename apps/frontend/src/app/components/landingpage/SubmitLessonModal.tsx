import { Button, Modal, Header, Icon } from "semantic-ui-react";
import { LessonPullRequest } from "@lessoneditor/contracts";
import { SUBMIT_LABEL, SubmitMode } from "./utils/submitMode";
import FieldError from "../shared/FieldError";
import { FC, useState } from "react";

import { paths } from "@lessoneditor/contracts";
import axios from "axios";
import { submitErrorMessage } from "./utils/submitError";
import { useNavigate } from "react-router";

const SubmitLessonModal: FC<{
  openSubmitModal: boolean;
  setOpenSubmitModal: (open: boolean) => void;
  lessonId: string;
  mode: SubmitMode;
  pullRequest?: LessonPullRequest;
  onSubmitted: () => void;
}> = ({ openSubmitModal, setOpenSubmitModal, lessonId, mode, pullRequest, onSubmitted }) => {
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
        submitMessage,
      );
      setPullRequestUrl(data?.url ?? null);
      setIsSubmitted(true);
      onSubmitted();
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
            <Header>
              {mode === "update"
                ? "Endringene er lagt til i forslaget ditt"
                : "Oppgaven er sendt inn til Lær Kidsa Koding"}
            </Header>
            <p>Lær Kidsa Koding går gjennom forslaget før det publiseres.</p>
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
            <Modal.Header>{SUBMIT_LABEL[mode]}</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                {mode === "update" ? (
                  <p>
                    Endringene legges til i{" "}
                    <a href={pullRequest?.url} target="_blank" rel="noopener noreferrer">
                      forslaget du har sendt inn
                    </a>
                    , som fortsatt venter på gjennomgang. Det blir ikke et nytt forslag.
                  </p>
                ) : mode === "again" ? (
                  <p>
                    {pullRequest?.state === "merged"
                      ? "Det forrige forslaget er tatt med i oppgavene. "
                      : "Det forrige forslaget ble lukket uten å bli tatt med. "}
                    Sender du inn nå, blir det et <strong>nytt forslag</strong> med oppgaven slik
                    den er i dag.{" "}
                    {pullRequest && (
                      <a href={pullRequest.url} target="_blank" rel="noopener noreferrer">
                        Se det forrige
                      </a>
                    )}
                  </p>
                ) : (
                  <p>
                    Oppgaven blir gjennomgått før den publiseres på nettsiden til{" "}
                    <a
                      href="https://oppgaver.kidsakoder.no"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Lær Kidsa Koding
                    </a>
                    .
                  </p>
                )}
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
              {error && <FieldError>{error}</FieldError>}
            </Modal.Content>

            <Modal.Actions>
              <>
                <Button disabled={loading} color="black" onClick={() => setOpenSubmitModal(false)}>
                  Avbryt
                </Button>
                {/* Sending takes 10–15 s: say so, instead of an empty grey button (4). */}
                <Button positive onClick={() => onSubmit(lessonId)} disabled={loading}>
                  {loading ? (
                    <>
                      <Icon name="spinner" loading aria-hidden="true" />
                      Sender inn …
                    </>
                  ) : (
                    SUBMIT_LABEL[mode]
                  )}
                </Button>
              </>
            </Modal.Actions>
          </>
        )}
      </Modal>
    </>
  );
};

export default SubmitLessonModal;
