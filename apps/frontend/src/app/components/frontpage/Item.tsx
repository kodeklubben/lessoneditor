import { LessonDTO } from "@lessoneditor/contracts";
import React, { useState } from "react";
import { Button, Card, Image, Icon, Popup, Placeholder } from "semantic-ui-react";

import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext";

import DeleteModal from "../shared/DeleteModal";

interface Props {
  lesson: LessonDTO;
}

const Item: React.FC<Props> = ({ lesson }) => {
  const navigate = useNavigate();
  const [openDeleteLesson, setOpenDeleteLesson] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { removeLesson, previewImage } = useUserContext();

  const deleteLesson = async () => {
    try {
      setLoading(true);
      await removeLesson(lesson.lessonId);
      setOpenDeleteLesson(false);
      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  const navigateToHome = (lessonId: string) => {
    const target = ["/landingpage", lessonId, "lessontexts"].join("/");
    navigate(target);
  };

  return (
    <>
      {openDeleteLesson && (
        <DeleteModal
          openDeleteContent={openDeleteLesson}
          setOpenDeleteContent={setOpenDeleteLesson}
          deleteContent={deleteLesson}
          loading={loading}
        />
      )}

      <Card
        style={{ border: "3px solid #0fbe7b", width: "16em", height: "21em", marginRight: "2em" }}
      >
        <div style={{ position: "relative", height: "160px" }}>
          <Image
            src={previewImage[lesson.lessonId]}
            size="medium"
            bordered
            rounded
            style={{
              height: "100%",
              maxWidrg: "120px",
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
        </div>
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
              setOpenDeleteLesson(true);
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
