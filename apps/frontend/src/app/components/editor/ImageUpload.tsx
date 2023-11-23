import { FC, Dispatch, SetStateAction, useState, Ref } from "react";
import ShowSpinner from "../ShowSpinner";
import { Modal, Button, Header } from "semantic-ui-react";
import { paths } from "@lessoneditor/contracts";
import axios from "axios";
import { NewFileDTO } from "@lessoneditor/contracts";
import { useLessonContext } from "../../contexts/LessonContext";
import { base64StringToBlob, createObjectURL, blobToBase64String } from "blob-util";
import slugify from "slugify";
import Compressor from "compressorjs";

const MAX_IMAGE_SIZE = 5000000;
const imageSizeErrorMessage = "Bildet kan ikke være over 5mb";

interface ImageUploadProps {
  uploadImageRef: Ref<HTMLInputElement>;
  mdText: string;
  cursorPositionStart: number;
  cursorPositionEnd: number;
  setMdText: Dispatch<SetStateAction<string>>;
  setCursor: (pos1: number, pos2: number) => void;
  setCursorPosition: (positionStart: number, positionEnd: number) => void;
}

const ImageUpload: FC<ImageUploadProps> = ({
  uploadImageRef,
  mdText,
  cursorPositionStart,
  cursorPositionEnd,
  setMdText,
  setCursor,
  setCursorPosition,
}) => {
  const start = cursorPositionStart + 2;
  const end = cursorPositionEnd + 18;

  const [showSpinner, setShowSpinner] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { state, setImages } = useLessonContext();

  const imageSubmitHandler = (imageInputValue: string) => {
    setMdText(
      mdText.slice(0, cursorPositionStart) +
        "![Bildebeskrivelse](" +
        "./" +
        imageInputValue +
        ")" +
        mdText.slice(cursorPositionStart)
    );

    setCursor(start, end);
    setCursorPosition(start, end);
  };

  const contentFunction = async (
    content: string,
    imageBlob: Blob,
    filename: string,
    ext: string
  ) => {
    const newFileDTO: NewFileDTO = {
      filename,
      ext,
      content: content,
    };
    await axios.post(
      paths.LESSON_FILES.replace(":lessonId", state.lesson.lessonId.toString()),
      newFileDTO
    );

    setImages((prevImages: any) => ({
      ...prevImages,
      [filename + ext]: createObjectURL(imageBlob),
    }));

    setShowSpinner(false);
    imageSubmitHandler(filename + ext);
  };

  const fileSelectedHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files) {
        return;
      }
      if (event.target.files[0].size > MAX_IMAGE_SIZE) {
        setErrorMessage(imageSizeErrorMessage);
        setShowModal(true);
        return;
      }

      const file: File = event.target.files[0];

      setShowSpinner(true);
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = async () => {
        try {
          if (reader.result) {
            const filename = slugify(file.name.split(".")[0], { lower: true, strict: true });
            const ext = `.${
              file.name.split(".").pop()?.toLowerCase() === "jpg"
                ? "jpeg"
                : file.name.split(".").pop()?.toLowerCase()
            }`;
            if (ext !== ".gif") {
              new Compressor(file, {
                maxHeight: 1080,
                maxWidth: 1080,
                resize: "cover",
                quality: 0.6, // 0.6 can also be used, but its not recommended to go below.
                success: async (compressedResult) => {
                  // compressedResult has the compressed file.
                  // Use the compressed file to upload the images to your server.

                  const contentString = await blobToBase64String(compressedResult);

                  contentFunction(contentString, compressedResult, filename, ext);
                },
              });
            } else {
              const content =
                reader.result.toString().split(`data:${file.type};base64,`).pop()! ?? "";

              contentFunction(content, base64StringToBlob(content, `image/${ext}`), filename, ext);
            }
          }
        } catch (error) {
          console.error(error);
        }
      };
    } catch (err) {
      console.log(err);
    }
  };

  const onClose = () => {
    setErrorMessage("");
    setShowModal(false);
  };

  return (
    <>
      {showSpinner ? <ShowSpinner /> : ""}
      <input
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.jpeg,.png,.gif"
        ref={uploadImageRef}
        onChange={fileSelectedHandler}
      />
      <Modal open={showModal}>
        <Modal.Header className="editor_modal">
          <Header as="h1"></Header>
        </Modal.Header>
        <Modal.Content className="editor_modal">{errorMessage}</Modal.Content>
        <Modal.Actions className="editor_modal">
          <Button onClick={onClose} content="OK" />
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default ImageUpload;
