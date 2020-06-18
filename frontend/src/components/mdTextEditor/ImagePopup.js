import React from "react";
import axios from "axios";

const ImagePopup = (props) => {
  const imageSizeErrorMessage = "Bildet kan ikke være over 5mb";

  const fileSelectedHandler = async (event) => {
    try {
      if (event.target.files && event.target.files[0].size > 5000000) {
        props.imagePopupSubmitHandler(imageSizeErrorMessage, "");
      } else {
        const fileName = event.target.files[0].name;
        props.storeImage(event.target.files[0]);
        const url = "/api/uploads/test";
        const formData = new FormData();
        formData.append("file", event.target.files[0]);
        const config = {
          headers: {
            "content-type": "multipart/form-data",
          },
        };
        const fileInfo = await axios.post(url, formData, config);
        props.imagePopupSubmitHandler(
          fileInfo.data.imageUrl,
          "filnavn: " + fileName
        );
      }
    } catch (err) {
      console.log(err);
      props.editorRef.current.focus();
    }
  };

  return (
    <input
      style={{ display: "none" }}
      type="file"
      accept=".jpg,.jpeg,.png,.gif"
      ref={props.uploadImageRef}
      onChange={fileSelectedHandler}
    />
  );
};

export default ImagePopup;
