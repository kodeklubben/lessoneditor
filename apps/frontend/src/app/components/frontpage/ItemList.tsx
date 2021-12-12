import { Card } from "semantic-ui-react";
import { LessonDTO } from "@lessoneditor/contracts";
import { Placeholder } from "semantic-ui-react";
import { FC } from "react";
import Item from "./Item";
import { useUserContext } from "../../contexts/UserContext";

interface ItemListProps {
  lessons: LessonDTO[];
}

const cardPlaceholder = (key: number) => {
  return (
    <Card key={key}>
      <Placeholder>
        <Placeholder.Image square />
      </Placeholder>

      <Card.Content>
        <Placeholder>
          <Placeholder.Header>
            <Placeholder.Line length="very short" />
            <Placeholder.Line length="medium" />
          </Placeholder.Header>
          <Placeholder.Paragraph>
            <Placeholder.Line length="short" />
          </Placeholder.Paragraph>
        </Placeholder>
      </Card.Content>

      <Card.Content extra></Card.Content>
    </Card>
  );
};

const ItemList: FC<ItemListProps> = ({ lessons }) => {
  const { loading } = useUserContext();
  return (
    <Card.Group>
      {!lessons
        ? cardPlaceholder(-1)
        : lessons.length > 0 && !loading
        ? lessons.map((lesson: LessonDTO) => <Item key={lesson.lessonId} lesson={lesson}></Item>)
        : lessons.map((lesson: LessonDTO) => cardPlaceholder(lesson.lessonId))}
    </Card.Group>
  );
};

export default ItemList;
