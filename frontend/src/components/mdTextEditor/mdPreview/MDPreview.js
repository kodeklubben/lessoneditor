import React, { useEffect } from "react";
import { renderMicrobit } from "utils/renderMicrobit";

const MDPreview = ({ parseMD }) => {
  useEffect(() => {
    renderMicrobit("nb");
  });
  return (
    <div
      className="PreviewArea"
      dangerouslySetInnerHTML={{ __html: parseMD }}
    />
  );
};

export default MDPreview;
