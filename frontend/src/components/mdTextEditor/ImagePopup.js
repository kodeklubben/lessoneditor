import React, { useState } from "react";

const ImagePopup = (props) => {
  const imageSizeErrorMessage = "Bildet kan ikke være over 5mb";

  const fileSelectedHandler = (event) => {
    try {
      if (event.target.files && event.target.files[0].size > 5000000) {
        props.imagePopupSubmitHandler(imageSizeErrorMessage, "");
      } else {
        let imageUrl = URL.createObjectURL(event.target.files[0]);
        let fileName = event.target.files[0].name;
        props.storeImage(event.target.files[0]);
        props.imagePopupSubmitHandler(imageUrl, "filnavn: " + fileName);
        imageUrl = "";
        fileName = "";
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
