import React from "react";

const MDPreview = ({ parseMD }) => {
  return (
    <div
      className="PreviewArea"
      dangerouslySetInnerHTML={{ __html: parseMD }}
    />
  );
};

export default MDPreview;
