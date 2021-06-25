import React from "react";
import { useHistory } from "react-router";
import { fileExists } from "utils/fileExists";

import { Button, Card, Icon, Image } from "semantic-ui-react";

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

const LessonCard = ({ title, lessonId, language, hasContent, lessonTitle }) => {
  const history = useHistory();

  const navigateToEditor = (lessonId, lessonTitle, language) => {
    const target = [
      "/editor",
      lessonId,
      language === "nb" ? lessonTitle : `${lessonTitle}_${language}`,
    ].join("/");
    history.push({ pathname: target });
  };

  return (
    <>
      <Card centered>
        <Card.Content>
          {hasContent ? (
            <>
              <Image
                src={
                  fileExists("/api/display/${lessonId}/preview.png")
                    ? `/api/display/${lessonId}/preview.png?${performance.now()}`
                    : "https://react.semantic-ui.com/images/wireframe/image.png"
                }
                size="medium"
                alt="thumbUrl"
              />

              <h2>{title + " (" + languageOptions[language].text + ")"}</h2>
            </>
          ) : (
            <>
              <Image
                src="https://react.semantic-ui.com/images/wireframe/image.png"
                size="medium"
                disabled
              />
              <h2>
                {"Ingen innhold" + " (" + languageOptions[language].text + ")"}
              </h2>
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
              src={languageOptions[language].image.src}
              alt={""}
            />
          ) : (
            ""
          )}

          <Button
            onClick={() => navigateToEditor(lessonId, lessonTitle, language)}
          >
            {hasContent ? "Åpne" : "Lag tekstfil"}
          </Button>
        </Card.Content>
      </Card>
    </>
  );
};

export default LessonCard;
