import React from "react";

class ImagePopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
      toBigMessage: ""
    };
  }

  fileSelectedHandler = event => {
    try {
      if (event.target.files && event.target.files[0].size > 4000000) {
        this.props.imagePopupSubmitHandler("Bildet kan ikke være over 5mb", "");
      } else {
        let imageUrl = URL.createObjectURL(event.target.files[0]);
        let fileName = event.target.files[0].name;
        this.props.storeImage(event.target.files[0]);
        this.setState({ toBigMessage: "" });
        this.props.imagePopupSubmitHandler(imageUrl, "filnavn: " + fileName);
        imageUrl = "";
        fileName = "";
        this.setState({ inputValue: "", toBigMessage: "" });
      }
    } catch (err) {
      console.log(err);
      this.props.editorRef.current.focus();
    }
  };

  render() {
    return (
      <input
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.jpeg,.png,.gif"
        ref={this.props.uploadImageRef}
        onChange={this.fileSelectedHandler}
      />
    );
  }
}

export default ImagePopup;
