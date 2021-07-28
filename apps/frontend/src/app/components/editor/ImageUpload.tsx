import { FC, useState } from "react";
import ShowSpinner from "../ShowSpinner";
import uploadImage from "../../api/upload-image";
import { useParams } from "react-router";

const imgRegex = /^[\w-]+(.jpg|.jpeg|.gif|.png)$/i;
const imageSizeErrorMessage = "Bildet kan ikke være over 5mb";

const ImageUpload: FC<any> = ({
  editorRef,
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

  const { lessonId } = useParams<any>();
  const [showSpinner, setShowSpinner] = useState(false);

  const fileNameErrorMessage =
    "Ugyldig filnavn, sjekk om det er mellomrom eller spesialtegn i filnavnet";

  const imageSubmitHandler = (imageInputValue: string) => {
    pushUndoValue(mdText, cursorPositionStart);
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
          imageInputValue +
          ")" +
          mdText.slice(cursorPositionStart)
      );
    }

    editorRef.current.focus();
    setCursor(start, end);
    setCursorPosition(start, end);
  };

  const fileSelectedHandler = async (event: any) => {
    try {
      if (event.target.files && event.target.files[0].size > 5000000) {
        imageSubmitHandler(imageSizeErrorMessage);
        return;
      }
      if (imgRegex.test(event.target.files[0].name)) {
        setShowSpinner(true);
        const fileInfo = await uploadImage(lessonId, event.target.files[0]);
        setShowSpinner(false);
        imageSubmitHandler(await fileInfo.imageUrl);
      } else {
        imageSubmitHandler("fileNameError");
      }
    } catch (err) {
      console.log(err);
      // editorRef.current.focus();
    }
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
    </>
  );
};

export default ImageUpload;
