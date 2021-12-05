import { Card } from "semantic-ui-react";
import { LessonDTO } from "../../../../../../libs/contracts/src/index";
import { FC } from "react";
import Item from "./Item";

interface ItemListProps {
  lessons: LessonDTO[];
}

const ItemList: FC<ItemListProps> = ({ lessons }) => {
  return (
    <Card.Group>
      {lessons.length > 0 &&
        lessons.map((lesson: LessonDTO) => <Item key={lesson.lessonId} lesson={lesson}></Item>)}
    </Card.Group>
  );
};

export default ItemList;
