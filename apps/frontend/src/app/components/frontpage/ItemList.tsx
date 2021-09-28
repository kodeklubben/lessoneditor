import { Button, Card, Image } from "semantic-ui-react";
import {LessonDTO} from "../../../../../../libs/lesson/src/lib/lesson.dto"
import { FC, useEffect } from "react";
import Item from "./Item"

interface ItemListProps {
  lessons: LessonDTO[]
  removeLesson: (lessonId: number) => void;
  navigateToHome: (lessonId: string) => void;
}

const ItemList: FC<ItemListProps> = ({ lessons, removeLesson, navigateToHome }) => {


  return (
    <Card.Group>
      {lessons.length > 0 &&
        lessons.map(
          (lesson: LessonDTO) => (
            <Item lesson={lesson} removeLesson={removeLesson} navigateToHome={navigateToHome} ></Item>  
          )
        )}
    </Card.Group>
  );
};

export default ItemList;
