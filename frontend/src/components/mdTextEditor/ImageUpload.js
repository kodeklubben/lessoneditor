import React from "react";
import axios from "axios";
import paths from "paths.json";
import { useParams } from "react-router";
import resolveUrlTemplate from "../../utils/resolve-url-template";

const ImageUpload = ({ imageSubmitHandler, editorRef, uploadImageRef }) => {
  const imageSizeErrorMessage = "Bildet kan ikke være over 5mb";
  const { course, lesson } = useParams();
  const fileSelectedHandler = async (event) => {
    try {
      if (event.target.files && event.target.files[0].size > 5000000) {
        imageSubmitHandler(imageSizeErrorMessage, "");
      } else {
        const fileName = event.target.files[0].name;
        const formData = new FormData();
        formData.append("file", event.target.files[0]);
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
        imageSubmitHandler(fileInfo.data.imageUrl, "filnavn: " + fileName);
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
