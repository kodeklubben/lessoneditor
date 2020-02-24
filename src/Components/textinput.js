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
