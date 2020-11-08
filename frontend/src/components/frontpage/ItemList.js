import "./itemlist.scss";
import React from "react";
import {
  Button,
  Card,
  CardContent,
  CardGroup,
  CardHeader,
  CardMeta,
  Image,
} from "semantic-ui-react";

function ItemList({ items, removeLesson, navigateToHome }) {
  return (
    <CardGroup>
      {items.length > 0 &&
        items.map((listitem, index) => (
          <Card key={"cardgroup-card-" + index}>
            <Image src={listitem.thumb} className={"itemListImage"}></Image>
            <CardContent>
              <CardHeader>{listitem.lesson.replace(/-/g, " ")}</CardHeader>
              <CardMeta>{listitem.course}</CardMeta>
            </CardContent>
            <CardContent extra>
              <Button onClick={() => navigateToHome(listitem.lessonId)}>
                Åpne
              </Button>
              <Button
                onClick={async () => {
                  await removeLesson(listitem.lessonId);
                }}
              >
                Fjerne
              </Button>
            </CardContent>
          </Card>
        ))}
    </CardGroup>
  );
}
export default ItemList;
