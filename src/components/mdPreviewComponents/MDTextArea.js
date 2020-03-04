import React from "react";

class MDTextArea extends React.Component {
  render() {
    return (
      <textarea
        autoFocus
        ref={this.props.editorRef}
        className="TextArea"
        value={this.props.textValue}
        onChange={e => this.props.onInputChange(e.target.value)}
        onKeyPress={e => this.props.onKeyPress(e)}
      />
    );
  }
}

export default MDTextArea;
