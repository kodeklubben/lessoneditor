import "./itemlist.scss";
import React from "react";
import { Button, Card, Image } from "semantic-ui-react";
import { fileExists } from "utils/fileExists";

function ItemList({ items, removeLesson, navigateToHome }) {
  return (
    <Card.Group>
      {items.length > 0 &&
        items.map((listitem, index) => (
          <Card key={"listitem" + index}>
            <Card.Content>
              <Image
                className={"itemListImage"}
                src={
                  fileExists(listitem.thumb)
                    ? `${listitem.thumb}?${performance.now()}`
                    : "/landingPage/image.png"
                }
                size="medium"
                rounded
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
}

export default ItemList;
