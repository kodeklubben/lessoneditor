import React from "react";
import { connect } from "react-redux";

class MDPreview extends React.Component {
  render() {
    return (
      <div
        className="MDPreviewSmall"
        dangerouslySetInnerHTML={{ __html: this.props.parseMD }}
      />
    );
  }
}

const mapStateToProps = state => {
  return { parseMD: state.parseMD };
};

export default connect(mapStateToProps)(MDPreview);
