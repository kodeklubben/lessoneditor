import "./textitem.scss";
import { useNavigate } from "react-router";
import { Button, Item, Icon } from "semantic-ui-react";
import { asButton } from "../../utils/a11y";
import { FC, useState } from "react";
import { languageOption } from "../frontpage/settings/newLessonOptions";

import DeleteModal from "../shared/DeleteModal";
import MarkdownPreview from "./MarkdownPreview";
import { useTextTitle } from "./useTextTitle";
import { useTextThumbnail } from "./useTextThumbnail";
import PreviewImage from "../shared/PreviewImage";

const TeacherguideItem: FC<any> = ({ lessonId, language, lessonTitle, lessonSlug, removeMD }) => {
  const navigate = useNavigate();
  const [openDeleteContent, setOpenDeleteContent] = useState<boolean>(false);
  const [showMDPreview, setShowMDPreview] = useState<boolean>(false);

  const filename = language === "nb" ? "README" : `README_${language}`;
  const title = useTextTitle(lessonId, filename);
  const thumbnail = useTextThumbnail(lessonId, filename);

  const navigateToEditor = (lessonId: any, lessonSlug: any, language: string) => {
    const target = ["/editor", lessonId, "README", language].join("/");
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
          deleteContent={() => removeMD(language, "README")}
          what={`lærerveiledningen på ${String(languageOption(language).text).toLowerCase()}`}
        />
      )}
      <Item className="lesson_menu_card">
        <div className="lesson_menu_card_content_container">
          <Item.Content
            className="lesson_menu_card_content"
            {...asButton(
              () => setShowMDPreview((prevValue) => !prevValue),
              `Forhåndsvis lærerveiledningen på ${languageText.toLowerCase()}`,
            )}
          >
            <PreviewImage
              className="lesson_menu_card_content__image"
              style={{ height: "3.5rem" }}
              src={thumbnail}
            />
          </Item.Content>
        </div>
        <div className="text_item__lessontitle">
          <span className="text_item__language">
            {language ? <img className="text_item__flag" src={languageImage} alt="" /> : null}
            {languageText}
          </span>
          <h2 className="text_item__title">{title ?? lessonTitle}</h2>
          <span className="text_item__kind">Lærerveiledning</span>
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
          <Button
            style={{ background: "none" }}
            icon
            onClick={() => setOpenDeleteContent(true)}
            aria-label={`Slett lærerveiledningen på ${languageText.toLowerCase()}`}
          >
            <Icon name="delete" />
            Slett
          </Button>
        </Item.Content>
      </Item>
    </>
  );
};

export default TeacherguideItem;
