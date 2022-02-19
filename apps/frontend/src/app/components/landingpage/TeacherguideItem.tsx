import { useNavigate } from "react-router";
import { Button, Card, Item, Image, Divider, Icon } from "semantic-ui-react";
import { FC, useState, useEffect } from "react";
import { LANGUAGEOPTIONS } from "../frontpage/settings/newLessonOptions";
import { useUserContext } from "../../contexts/UserContext";

import DeleteModal from "../shared/DeleteModal";

const TeacherguideItem: FC<any> = ({ lessonId, language, lessonTitle, lessonSlug, removeMD }) => {
  const navigate = useNavigate();
  const { previewImage } = useUserContext();
  const [openDeleteContent, setOpenDeleteContent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const deleteContent = async () => {
    try {
      setLoading(true);
      await removeMD(language, "README");
      setOpenDeleteContent(false);
      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  const navigateToEditor = (lessonId: any, lessonSlug: any, language: string) => {
    const target = ["/editor", lessonId, "README", language].join("/");
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
      <Item style={{ marginBottom: "1em", paddingTop: "2em" }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Item.Content style={{ position: "relative" }}>
            <Item.Image
              src={previewImage[lessonId]}
              size="tiny"
              alt="thumbUrl"
              rounded
              bordered
              style={{
                maxHeight: "9.4vh",
                overflow: "hidden",
                objectFit: "cover",
                objectPosition: "0 0",
                border: "1px solid lightgray",
              }}
            />

            {language ? (
              <Image
                style={{
                  width: "66%",
                  position: "absolute",
                  left: "0",
                  bottom: "0",
                }}
                src={languageImage}
                alt={""}
              />
            ) : (
              ""
            )}
          </Item.Content>

          <Item.Content
            style={{
              display: "flex",
              flexFlow: "column",
              justifyContent: "start",
              alignItems: "start",
              margin: "1em",
            }}
          >
            <Item.Header>
              <h3>{`Tittel: ${lessonTitle} (lærerveildening)`}</h3>
            </Item.Header>
            <Item.Meta>
              <h3>Språk: {languageText} </h3>
            </Item.Meta>
          </Item.Content>
        </div>
        <Item.Content
          style={{
            display: "flex",
            flexFlow: "row nowrap",
            justifyContent: "flex-end",
            alignItems: "center",
            margin: "1em",
          }}
        >
          <Button
            onClick={() => navigateToEditor(lessonId, lessonSlug, language)}
            content={"Rediger Tekst"}
            positive
          />
          <Button style={{ background: "none" }} icon onClick={() => setOpenDeleteContent(true)}>
            <Icon name="delete" />
            Slett
          </Button>
        </Item.Content>
      </Item>
    </>
  );
};

export default TeacherguideItem;