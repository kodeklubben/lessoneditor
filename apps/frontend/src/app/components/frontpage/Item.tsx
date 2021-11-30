import { LessonDTO, FileDTO } from "@lessoneditor/contracts";
import React, { useEffect, useState } from "react";
import { Button, Card, Image, Icon, Popup } from "semantic-ui-react";
import { paths } from "@lessoneditor/api-interfaces";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext";
import axios from "axios";

interface Props {
  lesson: LessonDTO;
}

const Item: React.FC<Props> = ({ lesson }) => {
  const navigate = useNavigate();
  const { removeLesson } = useUserContext();

  const navigateToHome = (lessonId: string) => {
    const target = ["/landingpage", lessonId, "lessontexts"].join("/");
    navigate(target);
  };
  const [image, setImage] = useState<string>();

  useEffect(() => {
    async function getImage() {
      try {
        const file: any = await axios.get(
          paths.LESSON_FILE.replace(":lessonId", lesson.lessonId.toString())
            .replace(":fileName", "preview")
            .replace(":ext", ".png")
        );
        setImage(file.data);
      } catch (error) {
        console.error(error);
      }
    }
    getImage();
  }, [lesson]);

  return (
    <>
      <Card>
        <Card.Content style={{ position: "relative" }}>
          <Image
            src={`data:image/png;base64,${image}`}
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
          {lesson.submitted && (
            <Popup
              content="Informasjon om levert oppgave.. Dato, etc"
              trigger={
                <Icon
                  name="github square"
                  size="huge"
                  style={{
                    position: "absolute",
                    bottom: "0",
                    right: "0",
                    transform: "rotate(10deg)",
                  }}
                />
              }
            ></Popup>
          )}
        </Card.Content>
        <Card.Content>
          <Card.Header>{lesson.lessonTitle ? lesson.lessonTitle : lesson.lessonSlug}</Card.Header>
          <Card.Meta>{lesson.courseTitle ? lesson.courseTitle : lesson.courseSlug}</Card.Meta>
        </Card.Content>

        <Card.Content extra>
          <Button
            icon
            labelPosition="left"
            onClick={() => navigateToHome(lesson.lessonId.toString())}
            positive
          >
            <Icon name="folder open" />
            Åpne
          </Button>
          <Button
            style={{ background: "none" }}
            icon
            onClick={() => {
              removeLesson(lesson.lessonId);
            }}
          >
            <Icon name="delete" />
            Slett
          </Button>
        </Card.Content>
      </Card>
    </>
  );
};

export default Item;
