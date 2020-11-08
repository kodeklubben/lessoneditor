import "./mdpreview.scss";
import React, { useEffect } from "react";
import { renderMicrobit } from "utils/renderMicrobit";
import { renderScratchBlocks } from "utils/renderScratchblocks";
import { mdParser } from "../../utils/mdParser";
import { renderToggleButtons } from "utils/renderToggleButton";

const MDPreview = ({ mdText, course, language, renderContent }) => {
  const parseMD = mdParser(mdText);
  useEffect(() => {
    renderToggleButtons();
    if (course === "microbit" && renderContent) {
      renderMicrobit(language);
    }
  }, [course, parseMD, renderContent, language]);

  const html =
    course === "scratch" && renderContent
      ? renderScratchBlocks(parseMD)
      : parseMD;

  return (
    <div
      data-testid="PreviewArea"
      className="PreviewArea"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default MDPreview;
