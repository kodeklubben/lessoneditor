import React from "react";

class ImagePopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
      toBigMessage: ""
    };
  }

  onChangeHandler = event => {
    event.preventDefault();
    this.setState({ inputValue: event.target.value });
  };

  fileSelectedHandler = event => {
    event.preventDefault();
    if (event.target.files && event.target.files[0].size > 5000000) {
      this.setState({ toBigMessage: "Bildet kan ikke være over 5mb" });
    } else {
      this.props.storeImage(event.target.files[0]);
      this.setState({ toBigMessage: "" });
      this.props.imagePopupSubmitHandler("./" + event.target.files[0].name);
    }
  };

  render() {
    return (
      <div className="transparent">
        <form
          className="imagePopup"
          onSubmit={() =>
            this.props.imagePopupSubmitHandler(this.state.inputValue)
          }
        >
          <h1>Last opp bilde:</h1>
          <div className="">
            <label>Link til bilde her:</label>
            <input
              autoFocus
              onChange={e => this.onChangeHandler(e)}
              value={this.state.inputValue}
              placeholder="Image URL"
            />
            <label>Last opp bilde her:</label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.gif"
              onChange={this.fileSelectedHandler}
            />
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
