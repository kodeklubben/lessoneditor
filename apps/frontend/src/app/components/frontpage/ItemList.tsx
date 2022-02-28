import { Card } from "semantic-ui-react";
import { LessonDTO } from "@lessoneditor/contracts";
import { FC } from "react";
import Item from "./Item";

interface ItemListProps {
  lessons: LessonDTO[];
}

const ItemList: FC<ItemListProps> = ({ lessons }) => {
  return (
    <div
      style={{
        display: "flex",
        flexFlow: "row wrap",
        alignItems: "center",
        justifyContent: "start",
        overflowX: "auto",
        paddingTop: "1.5em",
      }}
    >
      {lessons.map((lesson: LessonDTO) => (
        <Item key={lesson.lessonId} lesson={lesson}></Item>
      ))}
    </div>
  );
};

export default ItemList;
