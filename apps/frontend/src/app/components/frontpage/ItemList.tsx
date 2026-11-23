import { LessonDTO, LessonPullRequest } from "@lessoneditor/contracts";
import { FC } from "react";
import Item from "./Item";

interface ItemListProps {
  lessons: LessonDTO[];
  pullRequests: Record<number, LessonPullRequest>;
  mode?: "cards" | "list";
}

const ItemList: FC<ItemListProps> = ({ lessons, pullRequests, mode = "cards" }) => {
  return (
    <div className={`frontpage-lessons frontpage-lessons--${mode}`}>
      {lessons.map((lesson: LessonDTO) => (
        <Item key={lesson.lessonId} lesson={lesson} pullRequest={pullRequests[lesson.lessonId]} />
      ))}
    </div>
  );
};

export default ItemList;
