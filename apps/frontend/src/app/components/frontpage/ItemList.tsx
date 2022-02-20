import { Card } from "semantic-ui-react";
import { LessonDTO } from "@lessoneditor/contracts";
import { FC } from "react";
import Item from "./Item";

interface ItemListProps {
  lessons: LessonDTO[];
}

const ItemList: FC<ItemListProps> = ({ lessons }) => {
  console.log(lessons);
  return (
    <div
      style={{
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "center",
        justifyContent: "flex-start",
        overflowX: "auto",
      }}
    >
      {lessons.map((lesson: LessonDTO) => (
        <Item key={lesson.lessonId} lesson={lesson}></Item>
      ))}
    </div>
  );
};

export default ItemList;
