import "./frontpage.scss";
import { FC, useEffect, useState } from "react";
import NewLessonModal from "../components/frontpage/NewLessonModal";
import ItemList from "../components/frontpage/ItemList";
import { useUserContext } from "../contexts/UserContext";
import Navbar from "../components/navbar/Navbar";
import { Dropdown } from "semantic-ui-react";
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

  const handleSortChange = (e: any, { value }: any) => {
    setSortValue(value);
  };

  return (
    <>
      <Navbar />
      <div className="frontpage">
        <section className="frontpage-hero">
          <div className="le-column frontpage-hero__row">
            <h1 className="frontpage-brand">
              <span className="frontpage-brand__org">Lær Kidsa Koding</span>
              <span className="frontpage-brand__app le-display">Tekstbehandler</span>
            </h1>
            <NewLessonModal
              openNewLessonModal={openNewLessonModal}
              setOpenNewLessonModal={setOpenNewLessonModal}
            />
          </div>
        </section>
        <section className="le-column frontpage-lessons-section">
          <div className="frontpage-lessons-section__header">
            <h2 className="le-display">Mine oppgaver</h2>
            {state.lessons.length > 1 && (
              <Dropdown
                onChange={handleSortChange}
                inline
                options={sortOptions}
                value={sortValue}
                aria-label="Sorter oppgavene"
              />
            )}
          </div>

          {state.lessons.length > 0 ? (
            <ItemList lessons={userLessons} pullRequests={pullRequests} />
          ) : (
            <div className="frontpage-empty">
              <img src="assets/public/maskot.png" alt="" width={120} height={120} />
              <div>
                <h3>Du har ingen oppgaver ennå</h3>
                <p>
                  Lag den første med «Ny oppgave» øverst. Den starter fra en mal du kan skrive over.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
};
export default frontpage;
