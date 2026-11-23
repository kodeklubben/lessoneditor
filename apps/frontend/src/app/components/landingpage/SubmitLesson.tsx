import { LessonDTO, LessonPullRequest } from "@lessoneditor/contracts";
import SubmitLessonCard from "./SubmitLessonCard";

const SubmitLesson = (props: {
  lesson: LessonDTO;
  pullRequest?: LessonPullRequest;
  onSubmitted: () => void;
}) => {
  return (
    <>
      <div>
        <SubmitLessonCard {...props} />
      </div>
    </>
  );
};

export default SubmitLesson;
