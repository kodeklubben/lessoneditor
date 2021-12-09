import { useNavigate } from "react-router";
import { Button, Card, Image, Divider, Icon } from "semantic-ui-react";
import { FC, useState, useEffect } from "react";
import { LANGUAGEOPTIONS } from "../frontpage/settings/newLessonOptions";
import { useLessonContext } from "../../contexts/LessonContext";
import axios from "axios";
import { paths } from "@lessoneditor/contracts";

const LessonCard: FC<any> = ({ lessonId, language, lessonTitle, lessonSlug, removeMD }) => {
  const navigate = useNavigate();
  const { state } = useLessonContext();
  const [image, setImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function getImage() {
      try {
        const file: any = await axios.get(
          paths.LESSON_FILE.replace(":lessonId", lessonId.toString()).replace(
            ":fileName",
            "preview"
          )
        );
        setImage(file.data);
      } catch (error) {
        console.error(error);
      }
    }
    getImage();
  }, [lessonSlug]);

  const navigateToEditor = (lessonId: any, lessonSlug: any, language: string) => {
    const target = ["/editor", lessonId, lessonSlug, language].join("/");
    navigate({ pathname: target });
  };
  const imgSrc = "data:image/png;base64," + image;

  const lang = LANGUAGEOPTIONS.find((item) => item.value === language);

  const languageText = lang!.text;
  const languageImage = lang!.image!.src;

  return (
    <>
      <Card>
        <Card.Content>
          <Card.Content>
            <Image
              src={imgSrc}
              size="medium"
              alt="thumbUrl"
              rounded
              bordered
              style={{
                maxHeight: "220px",
                overflow: "hidden",
                objectFit: "cover",
                objectPosition: "0 0",
              }}
            />
          </Card.Content>

          <Card.Content>
            <Divider />
          </Card.Content>
          <Card.Content>
            <Card.Header>{lessonTitle}</Card.Header>
            <Card.Meta>{languageText}</Card.Meta>
          </Card.Content>
          <Card.Content>
            <Divider />
          </Card.Content>
          <Card.Content extra>
            <Button
              onClick={() => navigateToEditor(lessonId, lessonSlug, language)}
              content={"Åpne"}
              positive
            />
            <Button
              style={{ background: "none" }}
              icon
              onClick={() => removeMD(language, lessonSlug)}
            >
              <Icon name="delete" />
              Slett
            </Button>
          </Card.Content>
        </Card.Content>

        {language ? (
          <Image
            style={{
              width: "15%",
              position: "absolute",
              left: "80%",
              top: "57%",
            }}
            src={languageImage}
            alt={""}
          />
        ) : (
          ""
        )}
      </Card>
    </>
  );
};

export default LessonCard;
