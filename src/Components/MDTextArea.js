import React from "react";
import Button from "./Button";

class MDTextArea extends React.Component {
  state = { insertString: "" };

  onHandleChange = e => {
    this.props.onInputChange(e.target.value);
  };

  render() {
    return (
      <div>
        <div className="ui container">
          <Button
            output=" **bold text here** "
            icon="bold"
            onButtonClickHandler={this.props.handleButtonClick}
          />

          <Button
            output=" _italic text here_ "
            icon="italic"
            onButtonClickHandler={this.props.handleButtonClick}
          />

          <Button
            output=" {.activity} "
            title="Activity"
            onButtonClickHandler={this.props.handleButtonClick}
          />
        </div>

        <textarea
          className="TextArea"
          value={this.props.textValue}
          onChange={this.onHandleChange}
        />
      </div>
    );
  }
}

export default MDTextArea;
