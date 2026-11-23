import "./item.scss";
import { LessonDTO } from "@lessoneditor/contracts";
import React, { useState } from "react";
import { Button, Card, Icon, Popup } from "semantic-ui-react";
import { useNavigate } from "react-router";
import { useUserContext } from "../../contexts/UserContext";

import DeleteModal from "../shared/DeleteModal";
import PreviewImage from "../shared/PreviewImage";

interface Props {
  lesson: LessonDTO;
}

const Item: React.FC<Props> = ({ lesson }) => {
  const navigate = useNavigate();
  const [openDeleteLesson, setOpenDeleteLesson] = useState<boolean>(false);
  const { removeLesson, previewImage } = useUserContext();

  const submitDate = lesson.submitted_at ? new Date(lesson.submitted_at).toLocaleDateString() : "";

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
          deleteContent={() => removeLesson(lesson.lessonId)}
          what={`oppgaven «${lesson.lessonTitle || lesson.lessonSlug}»`}
          detail="Alle tekstene og bildene i oppgaven slettes."
        />
      )}
      <div className="card-item">
        <Card className="card">
          <Card.Content
            className="card-content"
            onClick={() => navigateToHome(lesson.lessonId.toString())}
          >
            <PreviewImage className="card-content__image" src={previewImage[lesson.lessonId]} />

            <Card.Content className="card-content__content">
              <Card.Header>
                {lesson.lessonTitle ? lesson.lessonTitle : lesson.lessonSlug}
              </Card.Header>
              <Card.Meta>{lesson.courseTitle ? lesson.courseTitle : lesson.courseSlug}</Card.Meta>
              {lesson.submitted && (
                <Popup trigger={<i className="check circle outline"></i>}>
                  <div>
                    <p>Denne oppgaven har blitt sendt inn til Lær Kidsa Koding</p>
                    <p>{`Dato: ${submitDate}`}</p>
                  </div>
                </Popup>
              )}
            </Card.Content>
          </Card.Content>

          <Card.Content className="extra_content">
            <Button
              className="button-mobile"
              icon
              onClick={() => navigateToHome(lesson.lessonId.toString())}
              positive
              aria-label={`Åpne ${lesson.lessonTitle}`}
            >
              <Icon name="folder open" />
            </Button>

            <Button
              className="button-desktop"
              icon
              labelPosition="left"
              onClick={() => navigateToHome(lesson.lessonId.toString())}
              positive
            >
              <Icon name="folder open" />
              Åpne
            </Button>

            <Button
              className="delete-button"
              style={{ background: "none" }}
              icon
              onClick={() => {
                setOpenDeleteLesson(true);
              }}
              aria-label={`Slett ${lesson.lessonTitle}`}
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
