import "./item.scss";
import { LessonDTO } from "@lessoneditor/contracts";
import React, { useState } from "react";
import { Button, Card, Image, Icon, Popup, Placeholder } from "semantic-ui-react";
import lkkLogo from "../../../assets/public/lkk_logo.png";
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

  const submitDate = new Date(lesson.submitted_at).toLocaleDateString();

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
    const target = ["/landingpage", lessonId].join("/");
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
      <div className="item_card" style={{ margin: "0 3em 2vh 0" }}>
        <Card
          style={{
            border: "3px solid #0fbe7b",
            borderRadius: "0px",
            width: "16em",
            height: "21em",
          }}
        >
          <Card.Content onClick={() => navigateToHome(lesson.lessonId.toString())}>
            <div
              style={{
                position: "relative",
                height: "160px",
                margin: "-1em -1em 0 -1em",
              }}
            >
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
            </div>
            <Card.Content style={{ marginTop: "1em", position: "relative" }}>
              <Card.Header>
                {lesson.lessonTitle ? lesson.lessonTitle : lesson.lessonSlug}
              </Card.Header>
              <Card.Meta>{lesson.courseTitle ? lesson.courseTitle : lesson.courseSlug}</Card.Meta>
              {lesson.submitted && (
                <Popup
                  trigger={
                    <Icon
                      name="checkmark"
                      size="big"
                      style={{
                        position: "absolute",
                        bottom: "0",
                        right: "0",
                      }}
                    ></Icon>
                  }
                >
                  <div>
                    <p>Denne oppgaven har blitt sendt inn til Lær Kidsa Koding</p>
                    <p>{`Dato: ${submitDate}`}</p>
                  </div>
                </Popup>
              )}
            </Card.Content>
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
      </div>
    </>
  );
};

export default Item;
