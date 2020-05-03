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
      <div className="transparent">
        <form className="imagePopup" onSubmit={this.mySubmitHandler}>
          <h1>Last opp bilde:</h1>
          <div className="">
            <label>
              Link til bilde her:
              <input
                autoFocus
                onChange={e => this.onChangeHandler(e)}
                value={this.state.inputValue}
                placeholder="Image URL"
              />
            </label>
            <label>
              Last opp bilde her:
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.gif"
                onChange={this.fileSelectedHandler}
              />
            </label>
            <div className="errorMessage">{this.state.toBigMessage}</div>
          </div>

          <div className="">
            <button type="submit" basic color="grey">
              OK
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default ImagePopup;
