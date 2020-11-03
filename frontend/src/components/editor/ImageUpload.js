import React from "react";
import uploadImage from "../../api/upload-image";
import { useParams } from "react-router";

const imgRegex = /^[\w-]+(.jpg|.jpeg|.gif|.png)$/i;
const imageSizeErrorMessage = "Bildet kan ikke være over 5mb";

const ImageUpload = ({
  editorRef,
  uploadImageRef,
  mdText,
  pushUndoValue,
  cursorPositionStart,
  cursorPositionEnd,
  setMdText,
  setCursorPositionStart,
  setCursorPositionEnd,
  setCursorPosition,
  setShowSpinner,
}) => {
  let start = cursorPositionStart + 2;
  let end = cursorPositionEnd + 18;

  const fileNameErrorMessage =
    "Ugyldig filnavn, sjekk om det er mellomrom eller spesialtegn i filnavnet";

  const imageSubmitHandler = (imageInputValue) => {
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
    setCursorPositionStart(start);
    setCursorPositionEnd(end);
    setCursorPosition(start, end);
  };
  const { lessonId } = useParams();

  const fileSelectedHandler = async (event) => {
    try {
      setShowSpinner(true);
      if (event.target.files && event.target.files[0].size > 5000000) {
        imageSubmitHandler(imageSizeErrorMessage);
        return;
      }
      if (imgRegex.test(event.target.files[0].name)) {
        const fileInfo = await uploadImage(
          lessonId,
          event.target.files[0]
        ).then(setShowSpinner(false));
        imageSubmitHandler(fileInfo.imageUrl);
      } else {
        imageSubmitHandler("fileNameError");
        setShowSpinner(false);
      }
    } catch (err) {
      console.log(err);
      // editorRef.current.focus();
    }
  };

  return (
    <input
      style={{ display: "none" }}
      type="file"
      accept=".jpg,.jpeg,.png,.gif"
      ref={uploadImageRef}
      onChange={fileSelectedHandler}
    />
  );
};

export default ImageUpload;
