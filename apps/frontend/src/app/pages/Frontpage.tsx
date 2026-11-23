import "./frontpage.scss";
import React, { FC, useEffect, useState } from "react";
import NewLessonModal from "../components/frontpage/NewLessonModal";
import ItemList from "../components/frontpage/ItemList";
import { useUserContext } from "../contexts/UserContext";
import Navbar from "../components/navbar/Navbar";
import { Card, Divider, Header, Icon, Message, Dropdown } from "semantic-ui-react";
import { LessonDTO, LessonPullRequest } from "@lessoneditor/contracts";
import { useLessonPullRequests } from "../components/frontpage/LessonStatus";
import { useNavigate } from "react-router";
import { takeReturnTo } from "../utils/returnTo";

const sortOptions = [
  { key: "date-modified", text: "Sist endret", value: "date-modified" },
  { key: "lesson-title", text: "Tittel", value: "lesson-title" },
  { key: "course-title", text: "Kurs", value: "course-title" },
  { key: "status", text: "Status", value: "status" },
];

/**
 * Waiting for review first, then published, not taken, and not submitted: what may need the
 * teacher's attention comes first.
 */
export function statusRank(lesson: LessonDTO, pullRequest?: LessonPullRequest): number {
  if (!lesson.submitted) return 3;
  return { open: 0, merged: 1, closed: 2 }[pullRequest?.state ?? "open"];
}

const newestFirst = (a: LessonDTO, b: LessonDTO) => (a.updated_at < b.updated_at ? 1 : -1);

export const sortLessons = (
  lessons: LessonDTO[],
  key: string,
  pullRequests: Record<number, LessonPullRequest> = {},
) => {
  const sortedLessons = [...lessons];
  switch (key) {
    case "date-modified":
      return sortedLessons.sort(newestFirst);
    case "lesson-title":
      return sortedLessons.sort((a, b) => a.lessonTitle.localeCompare(b.lessonTitle));
    case "course-title":
      return sortedLessons.sort((a, b) => a.courseTitle.localeCompare(b.courseTitle));
    case "status":
      return sortedLessons.sort(
        (a, b) =>
          statusRank(a, pullRequests[a.lessonId]) - statusRank(b, pullRequests[b.lessonId]) ||
          newestFirst(a, b),
      );
    default:
      return lessons;
  }
};

const frontpage: FC = () => {
  const { state } = useUserContext();
  const navigate = useNavigate();
  const [openNewLessonModal, setOpenNewLessonModal] = useState<boolean>(false);
  const [sortValue, setSortValue] = useState<string>("date-modified");
  const pullRequests = useLessonPullRequests(state.user?.userId, state.lessons);
  const [userLessons, setUserLessons] = useState<LessonDTO[]>(
    sortLessons(state.lessons, sortValue),
  );

  useEffect(() => {
    setUserLessons(sortLessons(state.lessons, sortValue, pullRequests));
  }, [state.lessons, sortValue, pullRequests]);

  // Back to the page the visitor came to before signing in, e.g. /rediger/<course>/<lesson>.
  useEffect(() => {
    const returnTo = takeReturnTo();
    if (returnTo) navigate(returnTo, { replace: true });
  }, [navigate]);

  function openModal() {
    if (!openNewLessonModal) setOpenNewLessonModal(true);
  }

  const handleSortChange = (e: any, { value }: any) => {
    setSortValue(value);
  };

  return (
    <>
      <Navbar />
      <div className="frontpage">
        <section className="frontpage_section1">
          <div className="frontpage_section1__container">
            <header className="frontpage_section1__header">
              <h1>
                <span>Lær Kidsa Koding</span> <span className="subtitle">Tekstbehandler</span>
              </h1>
            </header>

            <div className="frontpage_section1__cards">
              <label>
                <h3>Lag ny oppgave</h3>
              </label>
              <div className="card_container">
                <div className="card">
                  <Card>
                    <Card.Content className="card_content">
                      <Card.Content>
                        {/* A larger mouse target; the "Ny oppgave" button is the real control. */}
                        <Icon.Group
                          className="card_image_height"
                          onClick={openModal}
                          aria-hidden="true"
                          style={{ cursor: "pointer" }}
                        >
                          <Icon color="grey" name="file text outline" size="huge" />
                        </Icon.Group>
                      </Card.Content>

                      <Card.Content>
                        <Card.Header>
                          <Divider />
                        </Card.Header>
                      </Card.Content>
                      <Card.Content extra>
                        <NewLessonModal
                          openNewLessonModal={openNewLessonModal}
                          setOpenNewLessonModal={setOpenNewLessonModal}
                        />
                      </Card.Content>
                    </Card.Content>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="frontpage_section2">
          <div className="frontpage_section2_container">
            <div className="frontpage_section2_container__header">
              <Header as="h3">Mine oppgaver</Header>
              <Dropdown
                onChange={handleSortChange}
                inline
                options={sortOptions}
                // defaultValue={sortOptions[0].value}
                value={sortValue}
              />
            </div>

            {state.lessons.length > 0 ? (
              <ItemList lessons={userLessons} pullRequests={pullRequests} />
            ) : (
              <Message compact>
                <Message.Header>Du har ingen oppgaver ennå</Message.Header>
                <p>Opprett en ny oppgave ved å trykke på knappen "Ny oppgave"</p>
              </Message>
            )}
            <br />
          </div>
        </section>
      </div>
    </>
  );
};
export default frontpage;
