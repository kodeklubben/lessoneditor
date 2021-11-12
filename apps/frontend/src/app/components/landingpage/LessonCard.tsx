import { useHistory } from "react-router";
import { Button, Card, Image } from "semantic-ui-react";
import { FC, useState, useEffect } from "react";
import nbFlag from "../../../../src/assets/public/languagesFlag/flag_nb.svg"
import nnFlag from "../../../../src/assets/public/languagesFlag/flag_nn.svg";
import enFlag from "../../../../src/assets/public/languagesFlag/flag_en.svg";
import isFlag from "../../../../src/assets/public/languagesFlag/flag_is.svg";
import noLessonPreviewImage from "../../../../src/assets/public/landingPage/image.png";
import { useLessonContext } from "../../contexts/LessonContext";
import axios from "axios";
import { paths } from "@lessoneditor/api-interfaces";

const languageOptions: Record<string, any> = {
  nb: {
    text: "Bokmål",
    value: "nb",
    image: { avatar: true, src: nbFlag },
  },
  nn: {
    text: "Nynorsk",
    value: "nn",
    image: { avatar: true, src: nnFlag },
  },
  en: {
    text: "Engelsk",
    value: "en",
    image: { avatar: true, src: enFlag },
  },
  is: {
    text: "Islandsk",
    value: "is",
    image: { avatar: true, src: isFlag },
  },
};

const LessonCard: FC<any> = ({ lessonId, language, hasContent, lessonTitle, lessonSlug }) => {
  const history = useHistory();
  const { state } = useLessonContext();
  const [image, setImage] = useState<string>();

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
    const target = [
      "/editor",
      lessonId,
      language === "nb" ? lessonSlug : `${lessonSlug}_${language}`,
    ].join("/");
    history.push({ pathname: target });
  };
  const imgSrc = "data:image/png;base64," + image;

  const languageText = languageOptions[language].text;
  const languageImage = languageOptions[language].image.src;
  return (
    <>
      <Card centered>
        {hasContent ? (
          <>
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
              <Card.Header>{lessonTitle}</Card.Header>
              <Card.Meta>{languageText}</Card.Meta>
            </Card.Content>
          </>
        ) : (
          <>
            <Card.Content>
              <Image
                src={noLessonPreviewImage}
                size="medium"
                disabled
                rounded
                bordered
                style={{
                  maxHeight: "220px",
                  overflow: "hidden",
                  objectFit: "cover",
                }}
              />
            </Card.Content>
            <Card.Content>
              <Card.Header style={{ color: "gray" }}>Ingen innhold</Card.Header>
              <Card.Meta>{languageText}</Card.Meta>
            </Card.Content>
          </>
        )}

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
        <div className="extra content">
          <Button
            onClick={() => navigateToEditor(lessonId, lessonSlug, language)}
            content={hasContent ? "Åpne" : "Lag tekstfil"}
            positive={hasContent}
          />
        </div>
      </Card>
    </>
  );
};

export default LessonCard;
