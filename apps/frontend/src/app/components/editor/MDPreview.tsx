import "./mdpreview.scss";
import { FC, useEffect } from "react";
import { renderMicrobit } from "../../utils/renderMicrobit";
import { renderScratchBlocks } from "../../utils/renderScratchblocks";
import { mdParser } from "../../utils/mdParser";
import { renderToggleButtons } from "../../utils/renderToggleButton";

const MDPreview: FC<any> = ({
  previewRef,
  editorRef,
  mdText,
  course,
  language,
  renderContent,
}) => {
  const parseMD = mdParser(mdText);

  useEffect(() => {
    renderToggleButtons();
    if (course === "microbit" && renderContent) {
      renderMicrobit(language);
    }
  }, [course, parseMD, renderContent, language]);

  if (course === "scratch" && renderContent) {
    const lessonContent = renderScratchBlocks(parseMD);
    return (
      <div
        className="PreviewArea"
        dangerouslySetInnerHTML={{ __html: lessonContent }}
      />
    );
  } else {
    return (
      <div
        ref={previewRef}
        className="PreviewArea"
        dangerouslySetInnerHTML={{ __html: parseMD }}
      />
    );
  }
};

export default MDPreview;
