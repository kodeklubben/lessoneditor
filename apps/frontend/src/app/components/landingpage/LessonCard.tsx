import { useNavigate } from "react-router";
import { Button, Card, Image, Divider } from "semantic-ui-react";
import { FC, useState, useEffect } from "react";
import nbFlag from "../../../../src/assets/public/languagesFlag/flag_nb.svg";
import nnFlag from "../../../../src/assets/public/languagesFlag/flag_nn.svg";
import enFlag from "../../../../src/assets/public/languagesFlag/flag_en.svg";
import isFlag from "../../../../src/assets/public/languagesFlag/flag_is.svg";
import noLessonPreviewImage from "../../../../src/assets/public/landingPage/image.png";
import { useLessonContext } from "../../contexts/LessonContext";
import axios from "axios";
import { paths } from "@lessoneditor/contracts";

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

const LessonCard: FC<any> = ({ lessonId, language, lessonTitle, lessonSlug }) => {
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

  const languageText = languageOptions[language].text;
  const languageImage = languageOptions[language].image.src;
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
