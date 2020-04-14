import React from "react";
import { Button, Card, Form } from "semantic-ui-react";

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
      this.props.imagePopupSubmitHandler(
        "bildet er lastet opp til frontend (sjekk console for utskrift av state)"
      );
    }
  };

  render() {
    return (
      <Card.Group className="imagePopup">
        <Card>
          <Form
            onSubmit={() =>
              this.props.imagePopupSubmitHandler(this.state.inputValue)
            }
          >
            <Card.Content>
              <Form.Field>
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
                <div style={{ color: "red" }}>{this.state.toBigMessage}</div>
              </Form.Field>
            </Card.Content>
            <Card.Content extra>
              <div className="ui two buttons">
                <Button type="submit" basic color="grey">
                  OK
                </Button>
              </div>
            </Card.Content>
          </Form>
        </Card>
      </Card.Group>
    );
  }
}

export default ImagePopup;
