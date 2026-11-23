import "./lessoncard.scss";
import React, { useState } from "react";
import { Card, Divider, Button, Header, Icon } from "semantic-ui-react";
import { useParams } from "react-router";
import { useUserContext } from "../../contexts/UserContext";
import SubmitlessonModal from "./SubmitLessonModal";
import PreviewImage from "../shared/PreviewImage";
import { LessonDTO, LessonPullRequest } from "@lessoneditor/contracts";
import { submitMode, SUBMIT_LABEL } from "./utils/submitMode";

const SubmitLessonCard = ({
  lesson,
  pullRequest,
  onSubmitted,
}: {
  lesson: LessonDTO;
  pullRequest?: LessonPullRequest;
  onSubmitted: () => void;
}) => {
  const mode = submitMode(lesson, pullRequest);
  const [openSubmitModal, setOpenSubmitModal] = useState(false);
  const { lessonId } = useParams() as any;
  const { previewImage } = useUserContext();
  const onSubmit = () => {
    setOpenSubmitModal(true);
  };

  return (
    <>
      {openSubmitModal && (
        <SubmitlessonModal
          openSubmitModal={openSubmitModal}
          setOpenSubmitModal={setOpenSubmitModal}
          lessonId={lessonId}
          mode={mode}
          pullRequest={pullRequest}
          onSubmitted={onSubmitted}
        />
      )}
      <div>
        <Header>Sende inn oppgave</Header>
        <Card className="new-lesson_card">
          <div className="new-lesson_card__content">
            {/* A larger mouse target; keyboard and screen readers use the button below. */}
            <div className="new-lesson_card__image" onClick={onSubmit} aria-hidden="true">
              <PreviewImage
                style={{
                  height: "5rem",
                  width: "100%",
                  objectFit: "cover",
                  objectPosition: "0 0",
                  borderRadius: "10px",
                }}
                src={previewImage[lessonId]}
              />
            </div>
          </div>

          <Divider />

          <Button
            onClick={onSubmit}
            content={SUBMIT_LABEL[mode]}
            positive
            icon="envelope"
            labelPosition="left"
          />
        </Card>
      </div>
    </>
  );
};

export default SubmitLessonCard;
