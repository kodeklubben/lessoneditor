import "./mdpreview.scss";
import React, { useEffect } from "react";
import { renderMicrobit } from "utils/renderMicrobit";
import { renderScratchBlocks } from "utils/renderScratchblocks";
import { mdParser } from "../../utils/mdParser";
import { renderToggleButtons } from "utils/renderToggleButton";

const MDPreview = ({ mdText, course, renderContent }) => {
  const parseMD = mdParser(mdText);

  useEffect(() => {
    renderToggleButtons();
    if (course === "microbit" && renderContent) {
      //TODO: Get lesson language
      renderMicrobit("nb");
    }
  }, [course, parseMD, renderContent]);

  if (course === "scratch" && renderContent) {
    let lessonContent = renderScratchBlocks(parseMD);
    return (
      <div
        className="PreviewArea"
        dangerouslySetInnerHTML={{ __html: lessonContent }}
      />
    );
  } else {
    return (
      <div
        className="PreviewArea"
        dangerouslySetInnerHTML={{ __html: parseMD }}
      />
    );
  }
};

export default MDPreview;
