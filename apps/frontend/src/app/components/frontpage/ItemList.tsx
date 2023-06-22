import { LessonDTO } from "@lessoneditor/contracts";
import { FC } from "react";
import Item from "./Item";

interface ItemListProps {
  lessons: LessonDTO[];
}

const ItemList: FC<ItemListProps> = ({ lessons }) => {
  return (
    <div className="frontpage-lessons">
      {lessons.map((lesson: LessonDTO) => (
        <Item key={lesson.lessonId} lesson={lesson}></Item>
      ))}
    </div>
  );
};

export default ItemList;
