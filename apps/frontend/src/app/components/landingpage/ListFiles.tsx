import "./listfiles.scss";
import { FC, useEffect, useState } from "react";
import { Item, Button, Modal, Icon, Image, Header } from "semantic-ui-react";
import axios from "axios";
import { paths } from "@lessoneditor/contracts";
import { LANGUAGEOPTIONS } from "../frontpage/settings/newLessonOptions";
import { useLessonContext } from "../../contexts/LessonContext";
import { useUserContext } from "../../contexts/UserContext";
import { filenameParser } from "../../utils/filename-parser";
import MarkdownPreview from "./MarkdownPreview";
import DeleteModal from "../shared/DeleteModal";
import placeholderImage from "../../../assets/public/landingPage/image.png";

type ListFilesProps = {
  item: string;
  lessonId: string;
};

const ListFiles: FC<ListFilesProps> = ({ item, lessonId }) => {
  const { fetchFileList, setFiles } = useLessonContext();
  const [openDeleteContent, setOpenDeleteContent] = useState<boolean>(false);
  const [openImageModal, setOpenImageModal] = useState<boolean>(false);
  const { previewImage } = useUserContext();
  const { images } = useLessonContext();
  const [imageUrl, setImageUrl] = useState();
  const [showMDPreview, setShowMDPreview] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<string[]>([]);

  const { language } = filenameParser(item);

  const filename = item.split(".").slice(0, -1).toString();
  const ext: string = item.split(".").pop() ?? "";

  const isImage = ["jpeg", "png", "gif"].includes(ext);

  let lang;
  let languageImage;

  if (ext === "md") {
    lang = LANGUAGEOPTIONS.find((item) => item.value === language);

    languageImage = lang!.image!.src;
  }

  useEffect(() => {
    async function fetchFiles() {
      setFileList(await fetchFileList());
    }
    fetchFiles();
  }, []);

  const removeFile = async () => {
    try {
      const isDeleted = await axios.delete(
        paths.LESSON_FILE_DELETE.replace(":lessonId", lessonId.toString())
          .replace(":fileName", filename)
          .replace(":ext", ext)
      );
      if (isDeleted.data === 1) {
        const index = fileList.findIndex((item: string) => item === filename);
        const newList = fileList.splice(index, 1);
        setFiles(newList);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getFile = async () => {
    try {
      const res = await axios.get(
        paths.LESSON_FILE.replace(":lessonId", lessonId.toString()).replace(":fileName", filename)
      );
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      {isImage && openImageModal && (
        <Modal
          onClose={() => setOpenImageModal(false)}
          onOpen={() => setOpenImageModal(true)}
          open={openImageModal}
          trigger={<Button>Show Modal</Button>}
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
          loading={loading}
        />
      )}
      <Item className="all-files--container">
        <div className="all-files--content">
          <Item.Content
            onClick={
              ext == "md"
                ? () => setShowMDPreview((prevValue) => !prevValue)
                : isImage
                ? () => {
                    setOpenImageModal(true);
                  }
                : () => {
                    console.log("noPreviewContent");
                  }
            }
            className="all-files--image"
          >
            <Item.Image
              className="_image"
              src={
                ext === "md" ? previewImage[lessonId] : isImage ? images[item] : placeholderImage
              }
              size="tiny"
              alt="thumbUrl"
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
          <Button style={{ background: "none" }} icon onClick={() => setOpenDeleteContent(true)}>
            <Icon name="delete" />
            Slett
          </Button>
        </Item.Content>
      </Item>
    </>
  );
};

export default ListFiles;
