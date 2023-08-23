import "./lessoncard.scss";
import React, { useState } from "react";
import { Card, Divider, Button, Header, Image, Icon } from "semantic-ui-react";
import { useParams } from "react-router";
import { useUserContext } from "../../contexts/UserContext";
import SubmitlessonModal from "./SubmitLessonModal";

const SubmitLessonCard = () => {
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
        />
      )}
      <div>
        <Header>Sende inn oppgave</Header>
        <Card className="new-lesson_card">
          <div className="new-lesson_card__content">
            <div className="new-lesson_card__image" onClick={onSubmit}>
              <Image
                style={{
                  height: "5rem",
                  objectFit: "cover",
                  objectPosition: "0 0",
                  borderRadius: "10px",
                }}
                src={previewImage[lessonId]}
                fluid
                rounded
              />
            </div>
          </div>

          <Divider />

          <Button
            onClick={onSubmit}
            content="Sende inn "
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
