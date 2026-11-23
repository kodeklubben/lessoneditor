import "./courseinfo.scss";
import { LessonDTO, LessonPullRequest } from "@lessoneditor/contracts";
import LessonStatus from "../frontpage/LessonStatus";

type propTypes = {
  lessonTitle: string;
  courseTitle: string;
  isSubmitted: boolean;
  lesson: LessonDTO;
  pullRequest?: LessonPullRequest;
};

/** Title and course, and for a submitted lesson the same status as its card (3). */
const CourseInfo = ({ lessonTitle, courseTitle, isSubmitted, lesson, pullRequest }: propTypes) => {
  return (
    <section className="course-info">
      <p className="course-info__course">{courseTitle}</p>
      <h1 className="course-info__title le-display">{lessonTitle}</h1>
      {isSubmitted && (
        <p className="course-info__status">
          Forslaget på GitHub: <LessonStatus lesson={lesson} pullRequest={pullRequest} />
        </p>
      )}
    </section>
  );
};

export default CourseInfo;
