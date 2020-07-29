import React from "react";
import axios from "axios";
import paths from "paths.json";
import { useParams } from "react-router";
import resolveUrlTemplate from "../../utils/resolve-url-template";

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
}) => {
  const { course, lesson } = useParams();

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

  const fileSelectedHandler = async (event) => {
    try {
      if (event.target.files && event.target.files[0].size > 5000000) {
        imageSubmitHandler(imageSizeErrorMessage, "");
      } else {
        const formData = new FormData();
        formData.append("file", await event.target.files[0]);
        const config = {
          headers: {
            "content-type": "multipart/form-data",
          },
        };

        const uploadUrl = resolveUrlTemplate(paths.LESSON_UPLOADS, {
          course,
          lesson,
        });
        const fileInfo = await axios.post(uploadUrl, formData, config);
        imageSubmitHandler(fileInfo.data.imageUrl);
      }
    } catch (err) {
      console.log(err);
      editorRef.current.focus();
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
