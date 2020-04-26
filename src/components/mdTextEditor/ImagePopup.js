import React from "react";

class ImagePopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
      toBigMessage: ""
    };
  }

  onInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  fileSelectedHandler = event => {
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
        <div className="">
          <div className="">
            <form
              onSubmit={() =>
                this.props.imagePopupSubmitHandler(this.state.inputValue)
              }
            >
              <div className="">
                <div className="">
                  <label>Link til bilde her:</label>
                  <input
                    autoFocus
                    onChange={this.onInputChange}
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
              </div>

              <div className="">
                <button type="submit" basic color="grey">
                  OK
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default ImagePopup;
