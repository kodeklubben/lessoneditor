import React, { SyntheticEvent, useState, useEffect } from "react";
import {
  Card,
  Divider,
  Icon,
  Button,
  Dropdown,
  Placeholder,
  Header,
  Image,
} from "semantic-ui-react";
import { useNavigate, useParams } from "react-router";
import * as yaml from "js-yaml";
import { LANGUAGEOPTIONS } from "../frontpage/settings/newLessonOptions";
import { filenameParser } from "../../utils/filename-parser";
import axios from "axios";
import { NewFileDTO, HeaderData } from "@lessoneditor/contracts";
import { paths } from "@lessoneditor/contracts";
import { useLessonContext } from "../../contexts/LessonContext";
import { useUserContext } from "../../contexts/UserContext";
import { lessonGuideDefaultText } from "./settingsFiles/defaultTexts";
import lkkLogo from "../../../assets/public/lkk_logo.png";
import SubmitModal from "./SubmitModal";

const SubmitLessonCard = () => {
  const [openSubmitModal, setOpenSubmitModal] = useState(false);
  const { lessonId } = useParams() as any;

  const onSubmit = () => {
    setOpenSubmitModal(true);
  };

  return (
    <>
      {openSubmitModal && (
        <SubmitModal
          openSubmitModal={openSubmitModal}
          setOpenSubmitModal={setOpenSubmitModal}
          lessonId={lessonId}
        />
      )}
      <Header>Sende inn oppgave</Header>
      <Card
        style={{ border: "3px solid #0fbe7b", width: "16em", height: "15em", marginRight: "2em" }}
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
