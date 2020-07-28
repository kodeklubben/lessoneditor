import "./mdpreview.scss";
// import "../../../node_modules/highlight.js/scss/idea.scss";
import React, { useEffect } from "react";
import { renderMicrobit } from "utils/renderMicrobit";
import { mdParser } from "../../utils/mdParser";

const MDPreview = ({ mdText }) => {
  const parseMD = mdParser(mdText);
  useEffect(() => {
    renderMicrobit("nb");
  }, [parseMD]);
  return (
    <div
      className="PreviewArea"
      dangerouslySetInnerHTML={{ __html: parseMD }}
    />
  );
};

export default MDPreview;
