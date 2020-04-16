import React from "react";

class MDPreview extends React.Component {
  render() {
    return (
      <div
        className="MDPreviewSmall"
        dangerouslySetInnerHTML={{ __html: this.props.mdValue }}
      />
    );
  }
}

export default MDPreview;
