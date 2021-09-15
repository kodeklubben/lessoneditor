import "./mdpreview.scss";
import { FC, useEffect, useState } from "react";
import { renderMicrobit } from "../../utils/renderMicrobit";
import { renderScratchBlocks } from "../../utils/renderScratchblocks";
import { mdParser } from "../../utils/mdParser";

interface MDPreviewProps {
  mdText: string;
  course: string;
  language: string;
  cursorPositionStart?: number;
}

const MDPreview: FC<MDPreviewProps> = ({ mdText, course, language, cursorPositionStart }) => {
  let test;

  const parseMD = mdParser(mdText);

  useEffect(() => {
    if (course === "microbit") {
      renderMicrobit(language);
    }
  }, [parseMD]);

  if (course === "scratch" && parseMD) {
    const lessonContent = renderScratchBlocks(parseMD);
    return <div className="preview-area" dangerouslySetInnerHTML={{ __html: lessonContent }} />;
  } else {
    return <div className="preview-area" dangerouslySetInnerHTML={{ __html: parseMD }} />;
  }
};

export default MDPreview;
