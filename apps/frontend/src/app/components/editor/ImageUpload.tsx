import { FC, Dispatch, SetStateAction, useState, Ref } from "react";
import ShowSpinner from "../ShowSpinner";
import { useParams } from "react-router";
import { Modal, Button, Header } from "semantic-ui-react";
import { read } from "fs";
import { paths } from "../../../../../../libs/contracts/src/index";
import axios from "axios";
import { NewFileDTO } from "../../../../../../libs/contracts/src/index";
import { useLessonContext } from "../../contexts/LessonContext";
import { base64StringToBlob, createObjectURL } from "blob-util";

const imgRegex = /^[\w-]+(.jpg|.jpeg|.gif|.png)$/i;
const imageSizeErrorMessage = "Bildet kan ikke være over 5mb";

interface ImageUploadProps {
  uploadImageRef: Ref<HTMLInputElement>;
  mdText: string;
  pushUndoValue: (mdText: string, cursorPositionStart: number) => void;
  cursorPositionStart: number;
  cursorPositionEnd: number;
  setMdText: Dispatch<SetStateAction<string>>;
  setCursor: (pos1: number, pos2: number) => void;
  setCursorPosition: (positionStart: number, positionEnd: number) => void;
}

const ImageUpload: FC<ImageUploadProps> = ({
  uploadImageRef,
  mdText,
  pushUndoValue,
  cursorPositionStart,
  cursorPositionEnd,
  setMdText,
  setCursor,
  setCursorPosition,
}) => {
  let start = cursorPositionStart + 2;
  let end = cursorPositionEnd + 18;

  const { lessonId } = useParams() as any;
  const [showSpinner, setShowSpinner] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { state, setImages, images } = useLessonContext();

  const fileNameErrorMessage =
    "Ugyldig filnavn, sjekk om det er mellomrom eller spesialtegn i filnavnet";

  const imageSubmitHandler = (imageInputValue: string) => {
    if (imageInputValue === "fileNameError") {
      setMdText(
        mdText.slice(0, cursorPositionStart) +
          fileNameErrorMessage +
          mdText.slice(cursorPositionStart)
      );
      start = start - 2;
      end = end - 18 + fileNameErrorMessage.length;
    } else {
      setMdText(
        mdText.slice(0, cursorPositionStart) +
          "![Bildebeskrivelse](" +
          '"' +
          imageInputValue +
          '"' +
          ")" +
          mdText.slice(cursorPositionStart)
      );
    }

    setCursor(start, end);
    setCursorPosition(start, end);
  };

  const fileSelectedHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files) {
        return;
      }
      if (event.target.files[0].size > 5000000) {
        setErrorMessage(imageSizeErrorMessage);
        setShowModal(true);
        return;
      }
      if (imgRegex.test(event.target.files[0].name)) {
        const file: File = event.target.files[0];
        setShowSpinner(true);
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = async () => {
          try {
            if (reader.result) {
              const filename = file.name.split(".")[0].toLowerCase();
              const ext = `.${
                file.name.split(".").pop()?.toLowerCase() === "jpg"
                  ? "jpeg"
                  : file.name.split(".").pop()?.toLowerCase()
              }`;
              const content =
                reader.result.toString().split(`data:${file.type};base64,`).pop()! ?? "";

              const newFileDTO: NewFileDTO = {
                filename,
                ext,
                content,
              };
              await axios.post(
                paths.LESSON_FILES.replace(":lessonId", state.lesson.lessonId.toString()),
                newFileDTO
              );

              setImages((prevImages: any) => ({
                ...prevImages,
                [filename + ext]: createObjectURL(base64StringToBlob(content, `image/${ext}`)),
              }));

              setShowSpinner(false);
              imageSubmitHandler(filename + ext);
            }
          } catch (error) {
            console.error(error);
          }
        };
      } else {
        setErrorMessage("fileNameError");
        setShowModal(true);
      }
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
