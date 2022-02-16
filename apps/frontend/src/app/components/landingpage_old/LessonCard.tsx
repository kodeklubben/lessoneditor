import { useNavigate } from "react-router";
import { Button, Card, Image, Divider, Icon } from "semantic-ui-react";
import { FC, useState, useEffect } from "react";
import { LANGUAGEOPTIONS } from "../frontpage/settings/newLessonOptions";
import { useUserContext } from "../../contexts/UserContext";

import DeleteModal from "../shared/DeleteModal";

const LessonCard: FC<any> = ({ lessonId, language, lessonTitle, lessonSlug, removeMD }) => {
  const navigate = useNavigate();
  const { previewImage } = useUserContext();
  const [openDeleteContent, setOpenDeleteContent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const deleteContent = async () => {
    try {
      setLoading(true);
      await removeMD(language, lessonSlug);
      setOpenDeleteContent(false);
      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  const navigateToEditor = (lessonId: any, lessonSlug: any, language: string) => {
    const target = ["/editor", lessonId, lessonSlug, language].join("/");
    navigate({ pathname: target });
  };

  const lang = LANGUAGEOPTIONS.find((item) => item.value === language);

  const languageText = lang!.text;
  const languageImage = lang!.image!.src;

  return (
    <>
      {openDeleteContent && (
        <DeleteModal
          openDeleteContent={openDeleteContent}
          setOpenDeleteContent={setOpenDeleteContent}
          deleteContent={deleteContent}
          loading={loading}
        />
      )}
      <Card>
        <Card.Content>
          <Card.Content>
            <Image
              src={previewImage[lessonId]}
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
            <Button style={{ background: "none" }} icon onClick={() => setOpenDeleteContent(true)}>
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
