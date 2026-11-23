import { FC, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import axios from "axios";
import { Container, Header, Message } from "semantic-ui-react";
import { paths } from "@lessoneditor/contracts";
import Navbar from "../components/navbar/Navbar";
import ShowSpinner from "../components/ShowSpinner";
import { COURSESLIST } from "../components/frontpage/settings/newLessonOptions";
import { useUserContext } from "../contexts/UserContext";

/**
 * The server's message for a refused import (4xx), otherwise a general one. Validation errors
 * (400) come as a list of field messages, which mean nothing to a teacher.
 */
export function importErrorMessage(error: unknown): string {
  const response = (error as { response?: { status?: number; data?: { message?: unknown } } })
    ?.response;
  const status = response?.status ?? 500;
  if (status === 400 && typeof response?.data?.message !== "string")
    return "Adressen peker ikke på en oppgave. Den skal se slik ut: /rediger/<kurs>/<oppgave>, for eksempel /rediger/scratch/asteroids.";
  return typeof response?.data?.message === "string" && status < 500
    ? response.data.message
    : "Kunne ikke hente oppgaven fra GitHub. Prøv igjen litt senere.";
}

/** Asks for the copy's first thumbnail, from its bokmål text (named after lessonSlug). */
async function makeThumbnail(lessonId: number) {
  try {
    const { data } = await axios.get<{ lessonSlug: string }>(
      paths.LESSON.replace(":lessonId", String(lessonId)),
    );
    await axios.put(
      paths.LESSON_FILE_UPDATE_THUMB.replace(":lessonId", String(lessonId)).replace(
        ":filename",
        encodeURIComponent(data.lessonSlug),
      ),
    );
  } catch {
    // Cosmetic: the thumbnail is made again after the first edit.
  }
}

/**
 * /rediger/<course>/<lesson>: the "Rediger oppgave" link from oppgaver.kidsakoder.no, also with
 * the lesson page's own last part (/rediger/<course>/<lesson>/<text>). Copies the
 * lesson to the signed-in user (or opens their existing copy) and goes to it.
 */
const ImportLesson: FC = () => {
  const params = useParams();
  // Course folders in the repo are lower case; a hand-typed /rediger/Processing/… still works.
  const course = (params.course ?? "").toLowerCase();
  const lesson = params.lesson ?? "";
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
      .post<{ lessonId: number; existing: boolean }>(
        paths.USER_LESSON_IMPORT.replace(":userId", String(userId)),
        {
          course,
          lesson,
          courseTitle,
        },
      )
      .then(({ data }) => {
        // A thumbnail right away instead of after the first edit; it takes a few seconds and the
        // page shows a neutral picture meanwhile. A failure only leaves that picture.
        if (!data.existing) void makeThumbnail(data.lessonId);
        navigate(`/landingpage/${data.lessonId}`, { replace: true });
      })
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
