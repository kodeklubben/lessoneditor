import { useHistory } from "react-router";
import { Button, Card, Image } from "semantic-ui-react";
import { FC, useEffect, useState } from "react";
import nbFlag from "/assets/public/languagesFlag/flag_nb.svg";
import nnFlag from "/assets/public/languagesFlag/flag_nn.svg";
import enFlag from "/assets/public/languagesFlag/flag_en.svg";
import isFlag from "/assets/public/languagesFlag/flag_is.svg";
import noLessonPreviewImage from "/assets/public/landingPage/image.png";
import { FileDTO } from "@libs/lesson/src/lib/lesson.dto";
import { paths } from "@lessoneditor/api-interfaces";
import axios from "axios";

const languageOptions = {
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

const LessonCard: FC<any> = ({ title, lessonId, language, hasContent, lessonTitle }) => {
  const [image, setImage] = useState<FileDTO<string>>();
  useEffect(() => {
    async function getImage() {
      try {
        const file = await axios.get<FileDTO<string>>(
          paths.LESSON_FILE.replace(":lessonId", lessonId.toString()).replace(
            ":fileName",
            "preview"
          )
        );
        setImage(file.data);
      } catch (error) {
        console.error(error);
        const file: FileDTO<string> = {
          fileId: 0,
          filename: "",
          ext: ".png",
          content: "",
        };

        setImage(file);
      }
    }
    getImage();
  });
  const history = useHistory();

  const navigateToEditor = (lessonId: any, lessonTitle: any, language: string) => {
    const target = [
      "/editor",
      lessonId,
      language === "nb" ? lessonTitle : `${lessonTitle}_${language}`,
    ].join("/");
    history.push({ pathname: target });
  };
  const imgSrc = `/api/display/${lessonId}/preview.png?${performance.now()}`;

  // @ts-ignore
  const languageText = languageOptions[language].text;
  // @ts-ignore
  const languageImage = languageOptions[language].image.src;
  return (
    <>
      <Card centered>
        {hasContent ? (
          <>
            <Card.Content>
              <Image
                src={image?.content}
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
            onClick={() => navigateToEditor(lessonId, lessonTitle, language)}
            content={hasContent ? "Åpne" : "Lag tekstfil"}
            positive={hasContent}
          />
        </div>
      </Card>
    </>
  );
};

export default LessonCard;
