import "./mdpreview.scss";
import React, { useEffect } from "react";
import { renderMicrobit } from "utils/renderMicrobit";
import { mdParser } from "../../utils/mdParser";
import { renderScratchBlocks } from "../../utils/renderScratchblocks";

const MDPreview = ({ mdText, course }) => {
  const parseMD = mdParser(mdText);
  useEffect(() => {
    if (course === "Micro:bit" || course === "microbit") {
      renderMicrobit("nb");
    }
  }, [course, parseMD]);

  if (course === "Scratch" || course === "scratch") {
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
