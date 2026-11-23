import { FC, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Container, Header, Message } from "semantic-ui-react";
import Navbar from "../components/navbar/Navbar";
import ShowSpinner from "../components/ShowSpinner";
import { COURSESLIST } from "../components/frontpage/settings/newLessonOptions";
import { useUserContext } from "../contexts/UserContext";
import { useCatalog } from "../utils/useCatalog";
import { copyLessonFromRepo, importErrorMessage } from "../utils/importLesson";

export { importErrorMessage } from "../utils/importLesson";

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
  // The repo's course title when it is already read; the import does not wait for it.
  const catalog = useCatalog();
  const [error, setError] = useState("");
  const started = useRef(false);

  useEffect(() => {
    const userId = state.user?.userId;
    if (!userId || started.current) return;
    started.current = true;
    const courseTitle =
      catalog?.courses.find((item) => item.value === course)?.text ??
      COURSESLIST.find((item) => item.value === course)?.text;
    copyLessonFromRepo(userId, course, lesson, courseTitle)
      .then(({ lessonId }) => navigate(`/landingpage/${lessonId}`, { replace: true }))
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
