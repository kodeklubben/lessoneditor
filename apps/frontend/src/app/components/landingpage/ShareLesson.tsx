import { FC, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Button, Header, Image, Input, Label, List, Modal } from "semantic-ui-react";
import { paths, UserDTO } from "@lessoneditor/contracts";
import { useUserContext } from "../../contexts/UserContext";
import FieldError from "../shared/FieldError";

type Member = Omit<UserDTO, "email"> & { owner: boolean };

/** The server's own words (a 404 for an unknown user, a 403 for a non-owner), or a general one. */
export function shareErrorMessage(error: unknown): string {
  const message = (error as { response?: { data?: { message?: unknown } } })?.response?.data
    ?.message;
  if (typeof message === "string") return message;
  if (Array.isArray(message) && typeof message[0] === "string") return message[0];
  return "Det gikk ikke. Prøv igjen.";
}

/**
 * «Del oppgaven» (#337): the owner shares the lesson with a colleague by GitHub username, for
 * instance someone who translates it, and can take people off it again; a member can leave.
 * Members edit the same texts; saving refuses to overwrite a text someone else saved meanwhile.
 */
const ShareLesson: FC<{ lessonId: number }> = ({ lessonId }) => {
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<Member[] | undefined>(undefined);
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const { state } = useUserContext();
  const navigate = useNavigate();
  const me = state.user?.userId;
  const isOwner = members?.some((member) => member.userId === me && member.owner) ?? false;

  const load = () =>
    axios
      .get<Member[]>(paths.LESSON_MEMBERS.replace(":lessonId", String(lessonId)))
      .then(({ data }) => setMembers(data))
      .catch((e) => setError(shareErrorMessage(e)));

  useEffect(() => {
    if (open) void load();
  }, [open]);

  const add = async (event: FormEvent) => {
    event.preventDefault();
    const name = username.trim().replace(/^@/, "");
    if (!name) return;
    setBusy(true);
    setError("");
    try {
      await axios.post(paths.LESSON_MEMBER_ADD.replace(":lessonId", String(lessonId)), {
        username: name,
      });
      setUsername("");
      await load();
    } catch (e) {
      setError(shareErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (member: Member) => {
    setBusy(true);
    setError("");
    try {
      await axios.delete(
        paths.LESSON_MEMBER.replace(":lessonId", String(lessonId)).replace(
          ":memberId",
          String(member.userId),
        ),
      );
      if (member.userId === me) {
        navigate("/");
        return;
      }
      await load();
    } catch (e) {
      setError(shareErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Button
        className="le-secondary"
        size="medium"
        icon="users"
        content="Del"
        onClick={() => setOpen(true)}
      />
      <Modal open={open} onClose={() => !busy && setOpen(false)} size="tiny" dimmer="inverted">
        <Modal.Header>Del oppgaven</Modal.Header>
        <Modal.Content>
          <p>
            Alle som har tilgang, kan skrive i tekstene og sende inn oppgaven. Skriver to i samme
            tekst samtidig, spør editoren hvilken versjon som skal gjelde.
          </p>
          <Header as="h3" size="small">
            Har tilgang
          </Header>
          {members === undefined && !error ? (
            <p>Henter …</p>
          ) : (
            <List divided verticalAlign="middle">
              {(members ?? []).map((member) => (
                <List.Item key={member.userId}>
                  {(isOwner && !member.owner) || (member.userId === me && !member.owner) ? (
                    <List.Content floated="right">
                      <Button
                        basic
                        size="small"
                        disabled={busy}
                        onClick={() => remove(member)}
                        content={member.userId === me ? "Forlat oppgaven" : "Fjern"}
                        aria-label={
                          member.userId === me
                            ? "Forlat oppgaven"
                            : `Fjern ${member.name || member.username} fra oppgaven`
                        }
                      />
                    </List.Content>
                  ) : null}
                  {member.photo ? <Image avatar src={member.photo} alt="" /> : null}
                  <List.Content>
                    <List.Header>
                      {member.name || member.username}
                      {member.owner && (
                        <Label size="mini" style={{ marginLeft: "0.5em" }}>
                          Eier
                        </Label>
                      )}
                    </List.Header>
                    {member.username && <List.Description>@{member.username}</List.Description>}
                  </List.Content>
                </List.Item>
              ))}
            </List>
          )}

          {isOwner && (
            <form onSubmit={add} style={{ marginTop: "1.5em" }}>
              <label htmlFor="share-username" style={{ fontWeight: 700, display: "block" }}>
                Legg til med GitHub-brukernavn
              </label>
              <div style={{ display: "flex", gap: "0.5em", marginTop: "0.4em" }}>
                <Input
                  id="share-username"
                  placeholder="kari-nordmann"
                  value={username}
                  onChange={(_e, data) => setUsername(String(data.value))}
                  disabled={busy}
                  style={{ flex: 1 }}
                />
                <Button
                  positive
                  type="submit"
                  disabled={busy || !username.trim()}
                  content="Legg til"
                />
              </div>
              <p style={{ color: "#5c6166", marginTop: "0.5em" }}>
                Personen må ha logget inn i Lesson Editor med GitHub minst én gang.
              </p>
            </form>
          )}
          <FieldError>{error}</FieldError>
        </Modal.Content>
        <Modal.Actions>
          <Button basic content="Lukk" disabled={busy} onClick={() => setOpen(false)} />
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default ShareLesson;
