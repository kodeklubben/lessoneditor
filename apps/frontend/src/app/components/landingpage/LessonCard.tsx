import { useHistory } from "react-router";
import { Button, Card, Image } from "semantic-ui-react";
import { FC } from "react";
import {fileExists} from "../../utils/fileExists";

const languageOptions = {
  nb: {
    text: "Bokmål",
    value: "nb",
    image: { avatar: true, src: "/languagesFlag/flag_nb.svg" },
  },
  nn: {
    text: "Nynorsk",
    value: "nn",
    image: { avatar: true, src: "/languagesFlag/flag_nn.svg" },
  },
  en: {
    text: "Engelsk",
    value: "en",
    image: { avatar: true, src: "/languagesFlag/flag_en.svg" },
  },
  is: {
    text: "Islandsk",
    value: "is",
    image: { avatar: true, src: "/languagesFlag/flag_is.svg" },
  },
};

const LessonCard: FC<any> = ({
  title,
  lessonId,
  language,
  hasContent,
  lessonTitle,
}) => {
  const history = useHistory();

  const navigateToEditor = (
    lessonId: any,
    lessonTitle: any,
    language: string
  ) => {
    const target = [
      "/editor",
      lessonId,
      language === "nb" ? lessonTitle : `${lessonTitle}_${language}`,
    ].join("/");
    history.push({ pathname: target });
  };
  const imgSrc = fileExists(`/api/display/${lessonId}/preview.png`)
    ? `/api/display/${lessonId}/preview.png?${performance.now()}`
    : "/landingPage/image.png";
  // @ts-ignore
  const languageText = languageOptions[language].text;
  // @ts-ignore
  const languageImage = languageOptions[language].image.src
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
                src="/landingPage/image.png"
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
