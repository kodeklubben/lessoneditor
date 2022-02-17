import React, { useState } from "react";
import { Card, Divider, Icon, Button, Header } from "semantic-ui-react";
import { useNavigate } from "react-router";
import * as yaml from "js-yaml";
import axios from "axios";
import { NewFileDTO, HeaderData } from "@lessoneditor/contracts";
import { paths } from "@lessoneditor/contracts";
import { useLessonContext } from "../../contexts/LessonContext";
import { useUserContext } from "../../contexts/UserContext";
import { lessonGuideDefaultText } from "./settingsFiles/defaultTexts";
import NewLessontextModal from "./NewLessontextModal";

const NewLessontextCard = () => {
  const [openNewLessontextModal, setOpenNewLessontextModal] = useState(false);
  const [lang, setLang] = useState<string>("-1");

  const navigate = useNavigate();

  const { state: lessonState } = useLessonContext();
  const { state: userState } = useUserContext();

  const { lessonTitle, lessonSlug, lessonId } = lessonState.lesson;
  const name = userState.user!.name;
  const username = userState.user!.username;

  const header: HeaderData = {
    title: lessonTitle,
    author: name || username,
    authorList: [],
    language: lang,
    translator: "",
    translatorList: [],
  };

  const onSubmit = async () => {
    try {
      const rawBody = "---\n" + yaml.dump(header) + "---\n" + lessonGuideDefaultText[lang];
      const filename = lang === "nb" ? lessonSlug : `${lessonSlug}_${lang}`;
      const newLessonFileDTO: NewFileDTO = {
        filename,
        ext: ".md",
        content: rawBody,
      };
      const newLessonFileRes = await axios.post<number>(
        paths.LESSON_FILES.replace(":lessonId", lessonId.toString()),
        newLessonFileDTO
      );
    } catch (e) {
      console.error(e);
    }

    const target = ["/editor", lessonId, lessonSlug, lang].join("/");

    navigate(target);
  };

  return (
    <>
      {openNewLessontextModal && (
        <NewLessontextModal
          openNewLessontextModal={openNewLessontextModal}
          setOpenNewLessontextModal={setOpenNewLessontextModal}
          lessonId={lessonId}
        />
      )}
      <Header>Opprett ny tekstfil</Header>
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
              <Icon.Group>
                <Icon color="grey" name="file text outline" size="huge" />
              </Icon.Group>
            </div>
          </Card.Content>

          <Card.Content>
            <Divider />
          </Card.Content>
          <Card.Content extra>
            <Button
              onClick={() => setOpenNewLessontextModal(true)}
              content="Ny tekstfil "
              positive
              icon="plus"
              labelPosition="left"
            />
          </Card.Content>
        </Card.Content>
      </Card>
    </>
  );
};

export default NewLessontextCard;
