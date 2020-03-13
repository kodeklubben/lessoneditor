import React from "react";
import { Button, Card, Form } from "semantic-ui-react";

class ImagePopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { inputValue: "" };
  }

  onInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  render() {
    return (
      <Card.Group className="imagePopup">
        <Card>
          <Form>
            <Card.Content>
              <Form.Field>
                <label>Link til bilde her:</label>
                <input
                  autoFocus
                  onChange={e => this.onInputChange(e)}
                  value={this.state.inputValue}
                  placeholder="Image URL"
                />
              </Form.Field>
            </Card.Content>
            <Card.Content extra>
              <div className="ui two buttons">
                <Button
                  onClick={() =>
                    this.props.imagePopupSubmitHandler(this.state.inputValue)
                  }
                  basic
                  color="grey"
                >
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
