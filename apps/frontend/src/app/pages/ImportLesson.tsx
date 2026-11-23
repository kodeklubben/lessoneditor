import { FC, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import axios from "axios";
import { Container, Header, Message } from "semantic-ui-react";
import { paths } from "@lessoneditor/contracts";
import Navbar from "../components/navbar/Navbar";
import ShowSpinner from "../components/ShowSpinner";
import { COURSESLIST } from "../components/frontpage/settings/newLessonOptions";
import { useUserContext } from "../contexts/UserContext";

/** The server's message for a refused import (4xx), otherwise a general one. */
export function importErrorMessage(error: unknown): string {
  const response = (error as { response?: { status?: number; data?: { message?: unknown } } })
    ?.response;
  return typeof response?.data?.message === "string" && (response.status ?? 500) < 500
    ? response.data.message
    : "Kunne ikke hente oppgaven fra GitHub. Prøv igjen litt senere.";
}

/**
 * /rediger/<course>/<lesson>: the "Rediger oppgave" link from oppgaver.kidsakoder.no. Copies the
 * lesson to the signed-in user (or opens their existing copy) and goes to it.
 */
const ImportLesson: FC = () => {
  const { course = "", lesson = "" } = useParams();
  const { state } = useUserContext();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const started = useRef(false);

  useEffect(() => {
    const userId = state.user?.userId;
    if (!userId || started.current) return;
    started.current = true;
    const courseTitle = COURSESLIST.find((item) => item.value === course)?.text;
    axios
      .post<{ lessonId: number }>(paths.USER_LESSON_IMPORT.replace(":userId", String(userId)), {
        course,
        lesson,
        courseTitle,
      })
      .then(({ data }) => navigate(`/landingpage/${data.lessonId}`, { replace: true }))
      .catch((e) => setError(importErrorMessage(e)));
  }, [state.user?.userId, course, lesson, navigate]);

  return (
    <>
      <Navbar />
      <Container style={{ marginTop: "3rem" }}>
        {error ? (
          <Message negative>
            <Header as="h1" size="medium">
              Kunne ikke åpne {course}/{lesson}
            </Header>
            <p>{error}</p>
            <Link to="/">Til mine oppgaver</Link>
          </Message>
        ) : (
          <>
            <Header as="h1" size="medium">
              Henter {course}/{lesson} fra kidsakoder.no …
            </Header>
            <ShowSpinner />
          </>
        )}
      </Container>
    </>
  );
};

export default ImportLesson;
