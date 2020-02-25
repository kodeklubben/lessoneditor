import React from "react";

class MDTextArea extends React.Component {
  render() {
    return (
      <textarea
        autoFocus
        className="TextArea"
        value={this.props.textValue}
        onChange={e => this.props.onInputChange(e.target.value)}
      />
    );
  }
}

export default MDTextArea;
