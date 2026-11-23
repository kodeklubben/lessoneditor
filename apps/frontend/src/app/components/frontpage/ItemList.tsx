import { LessonDTO } from "@lessoneditor/contracts";
import { FC } from "react";
import Item from "./Item";
import { useLessonPullRequests } from "./LessonStatus";
import { useUserContext } from "../../contexts/UserContext";

interface ItemListProps {
  lessons: LessonDTO[];
}

const ItemList: FC<ItemListProps> = ({ lessons }) => {
  const { state } = useUserContext();
  const pullRequests = useLessonPullRequests(state.user?.userId, lessons);
  return (
    <div className="frontpage-lessons">
      {lessons.map((lesson: LessonDTO) => (
        <Item key={lesson.lessonId} lesson={lesson} pullRequest={pullRequests[lesson.lessonId]} />
      ))}
    </div>
  );
};

export default ItemList;
