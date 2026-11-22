import { asButton } from "../../utils/a11y";
import "./listfiles.scss";
import { FC, useState } from "react";
import { Item, Button, Modal, Icon, Image } from "semantic-ui-react";
import axios from "axios";
import { deletionBlocker, paths, splitFilename } from "@lessoneditor/contracts";
import { languageOption } from "../frontpage/settings/newLessonOptions";
import { useLessonContext } from "../../contexts/LessonContext";
import { useUserContext } from "../../contexts/UserContext";
import { filenameParser } from "../../utils/filename-parser";
import MarkdownPreview from "./MarkdownPreview";
import DeleteModal from "../shared/DeleteModal";
import placeholderImage from "../../../assets/public/landingPage/image.png";

type ListFilesProps = {
  item: string;
  lessonId: string;
  /** Every file of the lesson, to know whether this one may be deleted. */
  files: string[];
};

const ListFiles: FC<ListFilesProps> = ({ item, lessonId, files }) => {
  const { fetchFileList, setFiles } = useLessonContext();
  const [openDeleteContent, setOpenDeleteContent] = useState<boolean>(false);
  const [openImageModal, setOpenImageModal] = useState<boolean>(false);
  const { previewImage } = useUserContext();
  const { images } = useLessonContext();
  const [showMDPreview, setShowMDPreview] = useState<boolean>(false);

  const { language } = filenameParser(item);

  const { filename, ext: dotExt } = splitFilename(item);
  const ext = dotExt.slice(1);

  const isImage = ["jpg", "jpeg", "png", "gif"].includes(ext);
  // lesson.yml, preview.png and the last lesson text stay (K15); the server refuses them too.
  const canDelete = !deletionBlocker(splitFilename(item), files.map(splitFilename));

  let lang;
  let languageImage;

  if (ext === "md") {
    lang = languageOption(language);

    languageImage = lang!.image!.src;
  }

  /** Throws on failure, so the dialog can show the server's reason. */
  const removeFile = async () => {
    await axios.delete(
      paths.LESSON_FILE_DELETE.replace(":lessonId", lessonId.toString())
        .replace(":filename", encodeURIComponent(filename))
        .replace(":ext", ext),
    );
    setFiles(await fetchFileList());
  };

  return (
    <>
      {isImage && openImageModal && (
        <Modal
          onClose={() => setOpenImageModal(false)}
          onOpen={() => setOpenImageModal(true)}
          open={openImageModal}
          dimmer="inverted"
        >
          <Modal.Header>{item}</Modal.Header>
          <Modal.Content image>
            <Image size="massive" src={images[item]} wrapped />
          </Modal.Content>
          <Modal.Content>
            <Modal.Description></Modal.Description>
            <Button
              onClick={() => setOpenImageModal(false)}
              style={{ position: "absolute", background: "none", top: "0", right: "0" }}
              icon
              aria-label="Lukk"
            >
              <Icon size="huge" name="x" />
            </Button>
          </Modal.Content>
        </Modal>
      )}
      {showMDPreview && ext === "md" && (
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
          deleteContent={removeFile}
        />
      )}
      <Item className="all-files--container">
        <div className="all-files--content">
          <Item.Content
            {...(ext == "md"
              ? asButton(() => setShowMDPreview((prevValue) => !prevValue), `Forhåndsvis ${item}`)
              : isImage
                ? asButton(() => setOpenImageModal(true), `Vis bildet ${item}`)
                : {})}
            className="all-files--image"
          >
            <Item.Image
              className="_image"
              src={
                ext === "md" ? previewImage[lessonId] : isImage ? images[item] : placeholderImage
              }
              size="tiny"
              alt=""
              rounded
              bordered
            />

            {language ? (
              <Image className="all-files--language-image" src={languageImage} alt={""} />
            ) : (
              ""
            )}
          </Item.Content>
          <Item.Content
            style={{
              display: "flex",
              flexFlow: "column nowrap",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 1em",
            }}
          >
            <Item.Header>
              <h3>{item}</h3>
            </Item.Header>
            <Item.Meta></Item.Meta>
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
          {canDelete && (
            <Button
              style={{ background: "none" }}
              icon
              onClick={() => setOpenDeleteContent(true)}
              aria-label={`Slett ${item}`}
            >
              <Icon name="delete" />
              Slett
            </Button>
          )}
        </Item.Content>
      </Item>
    </>
  );
};

export default ListFiles;
