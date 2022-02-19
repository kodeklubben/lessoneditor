import "./lessoncard.scss";
import React, { useState } from "react";
import { Card, Divider, Button, Header, Image } from "semantic-ui-react";
import { useParams } from "react-router";
import lkkLogo from "../../../assets/public/lkk_logo.png";
import SubmitlessonModal from "./SubmitLessonModal";

const SubmitLessonCard = () => {
  const [openSubmitModal, setOpenSubmitModal] = useState(false);
  const { lessonId } = useParams() as any;

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
      <Header>Sende inn oppgave</Header>
      <Card
        className="lessonCard"
        style={{
          width: "16em",
          height: "15em",
          margin: " 0 0vw 2vh 0",
        }}
      >
        <Card.Content>
          <Card.Content>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "110px",
              }}
            >
              <Image.Group>
                <Image src={lkkLogo} size="small" />
              </Image.Group>
            </div>
          </Card.Content>

          <Card.Content>
            <Divider />
          </Card.Content>
          <Card.Content extra>
            <Button
              onClick={onSubmit}
              content="Sende inn "
              positive
              icon="envelope"
              labelPosition="left"
            />
          </Card.Content>
        </Card.Content>
      </Card>
    </>
  );
};

export default SubmitLessonCard;
