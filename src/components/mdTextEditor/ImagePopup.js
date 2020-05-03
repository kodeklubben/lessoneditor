import React from "react";

class ImagePopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
      toBigMessage: ""
    };
  }

  mySubmitHandler = event => {
    event.preventDefault();
    this.props.imagePopupSubmitHandler(this.state.inputValue);
  };

  onChangeHandler = event => {
    event.preventDefault();
    this.setState({ inputValue: event.target.value });
  };

  fileSelectedHandler = event => {
    if (!event.target.files) {
      return;
    }
    if (event.target.files && event.target.files[0].size > 5000000) {
      this.setState({ toBigMessage: "Bildet kan ikke være over 5mb" });
    } else {
      let i = URL.createObjectURL(event.target.files[0]);
      this.props.storeImage(event.target.files[0]);
      this.setState({ toBigMessage: "" });
      this.props.imagePopupSubmitHandler(
        i,
        "filnavn: " + event.target.files[0].name
      );
    }
  };

  render() {
    return (
      <div
        className="transparent"
        // onClick={() => this.props.imagePopupSubmitHandler("")}
      >
        <div className="ui segment imagePopup">
          <form
            id="imagePopup"
            className="ui form"
            onSubmit={this.mySubmitHandler}
          >
            <h2>Bilder</h2>
            <div className="equal width fields">
              <div className="field">
                <label>
                  <input
                    autoFocus
                    onChange={e => this.onChangeHandler(e)}
                    value={this.state.inputValue}
                    placeholder="URL"
                  />
                </label>
                <div style={{ margin: "1rem" }} />
                <div className="field">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif"
                    ref={this.fileUpload}
                    onChange={this.fileSelectedHandler}
                  />

                  <div className="errorMessage">{this.state.toBigMessage}</div>
                </div>
              </div>
            </div>
            <div className="field">
              <button
                style={{ marginTop: "-15rem" }}
                type="submit"
                className="ui button"
              >
                OK
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default ImagePopup;
