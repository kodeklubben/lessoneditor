import "./textitem.scss";
import { useNavigate } from "react-router";
import { Button, Item, Icon } from "semantic-ui-react";
import { asButton } from "../../utils/a11y";
import { FC, useState } from "react";
import { languageOption } from "../frontpage/settings/newLessonOptions";
import { useUserContext } from "../../contexts/UserContext";

import DeleteModal from "../shared/DeleteModal";
import MarkdownPreview from "./MarkdownPreview";
import { useTextTitle } from "./useTextTitle";
import { useTextThumbnail } from "./useTextThumbnail";
import PreviewImage from "../shared/PreviewImage";

const LessontextItem: FC<any> = ({
  lessonId,
  language,
  lessonTitle,
  lessonSlug,
  removeMD,
  canDelete,
}) => {
  const navigate = useNavigate();
  const { previewImage } = useUserContext();
  const [openDeleteContent, setOpenDeleteContent] = useState<boolean>(false);
  const [showMDPreview, setShowMDPreview] = useState<boolean>(false);

  const filename = language === "nb" ? lessonSlug : `${lessonSlug}_${language}`;
  const title = useTextTitle(lessonId, filename);
  const thumbnail = useTextThumbnail(lessonId, filename);

  const navigateToEditor = (lessonId: any, lessonSlug: any, language: string) => {
    const target = ["/editor", lessonId, lessonSlug, language].join("/");
    navigate({ pathname: target });
  };

  const lang = languageOption(language);

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
          deleteContent={() => removeMD(language, lessonSlug)}
          what={`oppgaveteksten på ${String(lang?.text ?? language).toLowerCase()}`}
        />
      )}

      <Item className="lesson_menu_card">
        <div className="lesson_menu_card_content_container">
          <Item.Content
            className="lesson_menu_card_content"
            {...asButton(
              () => setShowMDPreview((prevValue) => !prevValue),
              `Forhåndsvis oppgaveteksten på ${languageText.toLowerCase()}`,
            )}
          >
            {/* Its own picture (1); bokmål falls back to the lesson's preview until it has one. */}
            <PreviewImage
              className="lesson_menu_card_content__image"
              style={{ height: "3.5rem" }}
              src={thumbnail ?? (language === "nb" ? previewImage[lessonId] : undefined)}
            />
          </Item.Content>
        </div>
        <div className="text_item__lessontitle">
          <span className="text_item__language">
            {language ? <img className="text_item__flag" src={languageImage} alt="" /> : null}
            {languageText}
          </span>
          <h2 className="text_item__title">{title ?? lessonTitle}</h2>
        </div>

        <Item.Content className="extra_content">
          <Button
            className="text_item_button__mobile"
            onClick={() => navigateToEditor(lessonId, lessonSlug, language)}
            icon="pencil"
            aria-label="Rediger"
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
          {/* The last lesson text cannot be deleted (K15); the server refuses it as well. */}
          {canDelete && (
            <Button
              className="text_item__delete"
              icon
              onClick={() => setOpenDeleteContent(true)}
              aria-label={`Slett oppgaveteksten på ${languageText.toLowerCase()}`}
            >
              <Icon name="trash alternate outline" />
              Slett
            </Button>
          )}
        </Item.Content>
      </Item>
    </>
  );
};

export default LessontextItem;
