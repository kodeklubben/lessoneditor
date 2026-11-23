import "./item.scss";
import { LessonDTO, LessonPullRequest } from "@lessoneditor/contracts";
import React, { useState } from "react";
import { Button, Card, Icon } from "semantic-ui-react";
import { useNavigate } from "react-router";
import { useUserContext } from "../../contexts/UserContext";

import DeleteModal from "../shared/DeleteModal";
import PreviewImage from "../shared/PreviewImage";
import LessonStatus from "./LessonStatus";

interface Props {
  lesson: LessonDTO;
  pullRequest?: LessonPullRequest;
}

const Item: React.FC<Props> = ({ lesson, pullRequest }) => {
  const navigate = useNavigate();
  const [openDeleteLesson, setOpenDeleteLesson] = useState<boolean>(false);
  const { removeLesson, previewImage } = useUserContext();

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
              {/* Two lines at most, so every card in a row has the same height (N12). */}
              <Card.Header title={lesson.lessonTitle || lesson.lessonSlug}>
                {lesson.lessonTitle ? lesson.lessonTitle : lesson.lessonSlug}
              </Card.Header>
              <Card.Meta>{lesson.courseTitle ? lesson.courseTitle : lesson.courseSlug}</Card.Meta>
              <div className="card-content__status">
                <LessonStatus lesson={lesson} pullRequest={pullRequest} />
              </div>
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
