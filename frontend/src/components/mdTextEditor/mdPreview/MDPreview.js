import React from "react";

const MDPreview = (props) => {
  return (
    <div
      className="PreviewArea"
      dangerouslySetInnerHTML={{ __html: props.parseMD }}
    />
  );
};

export default MDPreview;
