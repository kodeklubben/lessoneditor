import React from "react";
import uploadImage from "../../api/upload-image";
import { useParams } from "react-router";

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

  const imageSubmitHandler = (imageInputValue) => {
    pushUndoValue(mdText, cursorPositionStart);
    setMdText(
      mdText.slice(0, cursorPositionStart) +
        "![Bildebeskrivelse](" +
        imageInputValue +
        ")" +
        mdText.slice(cursorPositionStart)
    );

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
        imageSubmitHandler(imageSizeErrorMessage, "");
      } else {
        const fileName = event.target.files[0].name;

        const fileInfo = await uploadImage(
          lessonId,
          event.target.files[0]
        ).then(setShowSpinner(false));
        imageSubmitHandler(fileInfo.imageUrl, "filnavn: " + fileName);
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
