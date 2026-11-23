import "./frontpage.scss";
import { FC, useEffect, useState } from "react";
import NewLessonModal from "../components/frontpage/NewLessonModal";
import FindLessonModal from "../components/frontpage/FindLessonModal";
import { prefetchLessonCatalog } from "../utils/useLessonCatalog";
import { useViewMode } from "../utils/useViewMode";
import ViewToggle from "../components/shared/ViewToggle";
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
  const [viewMode, setViewMode] = useViewMode("frontpage");
  const pullRequests = useLessonPullRequests(state.user?.userId, state.lessons);
  const [userLessons, setUserLessons] = useState<LessonDTO[]>(
    sortLessons(state.lessons, sortValue),
  );

  useEffect(() => {
    setUserLessons(sortLessons(state.lessons, sortValue, pullRequests));
  }, [state.lessons, sortValue, pullRequests]);

  // The lessons for «Finn en oppgave» are read while the page sits idle, before anyone asks.
  useEffect(() => {
    if (!state.user) return undefined;
    const idle = window.requestIdleCallback ?? ((run: () => void) => window.setTimeout(run, 1500));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const handle = idle(() => prefetchLessonCatalog());
    return () => cancel(handle);
  }, [state.user]);

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
            <div className="frontpage-hero__actions">
              <FindLessonModal />
              <NewLessonModal
                openNewLessonModal={openNewLessonModal}
                setOpenNewLessonModal={setOpenNewLessonModal}
              />
            </div>
          </div>
        </section>
        <section className="le-column frontpage-lessons-section">
          <div className="frontpage-lessons-section__header">
            <h2 className="le-display">Mine oppgaver</h2>
            {state.lessons.length > 1 && (
              <div className="frontpage-lessons-section__tools">
                <ViewToggle mode={viewMode} onChange={setViewMode} />
                <Dropdown
                  onChange={handleSortChange}
                  inline
                  options={sortOptions}
                  value={sortValue}
                  aria-label="Sorter oppgavene"
                />
              </div>
            )}
          </div>

          {state.lessons.length > 0 ? (
            <ItemList lessons={userLessons} pullRequests={pullRequests} mode={viewMode} />
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
