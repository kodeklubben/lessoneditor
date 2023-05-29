import "./textitem.scss";
import { useNavigate } from "react-router";
import { Button, Icon, Image, Item } from "semantic-ui-react";
import { FC, useState } from "react";
import { LANGUAGEOPTIONS } from "../frontpage/settings/newLessonOptions";
import { useUserContext } from "../../contexts/UserContext";

import DeleteModal from "../shared/DeleteModal";
import MarkdownPreview from "./MarkdownPreview";

const LessontextItem: FC<any> = ({ lessonId, language, lessonTitle, lessonSlug, removeMD }) => {
  const navigate = useNavigate();
  const { previewImage } = useUserContext();
  const [openDeleteContent, setOpenDeleteContent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showMDPreview, setShowMDPreview] = useState<boolean>(false);

  const filename = language === "nb" ? lessonSlug : `${lessonSlug}_${language}`;

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
      {showMDPreview && (
        <MarkdownPreview
          filename={filename}
          showMDPreview={showMDPreview}
          setShowMDPreview={setShowMDPreview}
        />
      )}
      {openDeleteContent && (
        <DeleteModal
          openDeleteContent={openDeleteContent}
          setOpenDeleteContent={setOpenDeleteContent}
          deleteContent={deleteContent}
          loading={loading}
        />
      )}
      <Item className="lesson_menu_card">
        <div className="lesson_menu_card_content_container">
          <Item.Content
            className="lesson_menu_card_content"
            onClick={() => setShowMDPreview((prevValue) => !prevValue)}
          >
            <Item.Image
              className="lesson_menu_card_content__image"
              src={previewImage[lessonId]}
              size="tiny"
              alt="thumbUrl"
              rounded
              bordered
            />

            {language ? <Image className="image_flag" src={languageImage} alt={""} /> : ""}
          </Item.Content>
        </div>
        <div className="text_item__lessontitle">
          <Item.Header>
            <h2>{`Tittel: ${lessonTitle}`}</h2>
          </Item.Header>
          <Item.Content>
            <Item.Meta>
              <h3>Språk: {languageText}</h3>
            </Item.Meta>
          </Item.Content>
        </div>
        <Item.Content className="extra_content">
          <Button
            className="text_item_button__mobile"
            onClick={() => navigateToEditor(lessonId, lessonSlug, language)}
            icon="pencil"
            positive
          />
          <Button
            className="text_item_button__desktop"
            onClick={() => navigateToEditor(lessonId, lessonSlug, language)}
            icon="pencil"
            labelPosition="left"
            content={"Rediger"}
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

export default LessontextItem;
