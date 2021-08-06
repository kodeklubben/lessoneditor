import { Button, Card, Image } from "semantic-ui-react";
import { FC } from "react";

const ItemList: FC<any> = ({ items, removeLesson, navigateToHome }) => {
  return (
    <Card.Group>
      {items.length > 0 &&
      items.map((listitem: any, index: number) => (
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
                objectPosition: "0 0"
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
              onClick={() => navigateToHome(listitem.lessonId)}
              positive
            >
              Åpne
            </Button>
            <Button
              color="black"
              onClick={async () => {
                await removeLesson(listitem.lessonId);
              }}
            >
              Fjerne
            </Button>
          </Card.Content>
        </Card>
      ))}
    </Card.Group>
  );
};

export default ItemList;
