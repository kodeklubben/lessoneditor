import { Button, Card, Image, Icon } from "semantic-ui-react";
import { FC } from "react";

interface Lesson {
  course: string;
  courseTitle: string;
  lesson: string;
  lessonId: string;
  lessonTitle: string;
  thumb?: string;
}

export interface ItemListProps {
  items: Lesson[];
  removeLesson: (lessonId: string) => Promise<void>;
  navigateToHome: (lessonId: string) => void;
}

const ItemList: FC<ItemListProps> = ({ items, removeLesson, navigateToHome }) => {
  return (
    <Card.Group>
      {items.length > 0 &&
        items.map(
          (
            listitem: {
              course: string;
              courseTitle: string;
              lesson: string;
              lessonId: string;
              lessonTitle: string;
              thumb?: string;
            },
            index: number
          ) => (
            <Card key={"listitem" + index}>
              <Card.Content>
                <Image
                  src={`${listitem.thumb}?${performance.now()}`}
                  size="medium"
                  bordered
                  rounded
                  style={{
                    maxHeight: "220px",
                    overflow: "hidden",
                    objectFit: "cover",
                    objectPosition: "0 0",
                  }}
                />
              </Card.Content>
              <Card.Content>
                <Card.Header>
                  {listitem.lessonTitle ? listitem.lessonTitle : listitem.lesson}
                </Card.Header>
                <Card.Meta>
                  {listitem.courseTitle ? listitem.courseTitle : listitem.course}
                </Card.Meta>
              </Card.Content>

              <Card.Content extra>
                <Button
                  icon
                  labelPosition="left"
                  onClick={() => navigateToHome(listitem.lessonId)}
                  positive
                >
                  <Icon name="folder open" />
                  Åpne
                </Button>
                <Button
                  style={{ background: "none" }}
                  icon
                  onClick={() => {
                    removeLesson(listitem.lessonId);
                  }}
                >
                  <Icon name="delete" />
                  Slett
                </Button>
              </Card.Content>
            </Card>
          )
        )}
    </Card.Group>
  );
};

export default ItemList;
