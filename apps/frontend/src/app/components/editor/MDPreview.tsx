import "./mdpreview.scss";
import { FC, useEffect } from "react";
import { renderMicrobit } from "../../utils/renderMicrobit";
import { renderScratchBlocks } from "../../utils/renderScratchblocks";
import { mdParser } from "../../utils/mdParser";
import { renderToggleButtons } from "../../utils/renderToggleButton";

interface MDPreviewProps {
  mdText: string;
  course: string;
  language: string;
}

const MDPreview: FC<MDPreviewProps> = ({ mdText, course, language }) => {
  const parseMD = mdParser(mdText);

  useEffect(() => {
    renderToggleButtons();
    if (course === "microbit") {
      renderMicrobit(language);
    }
  }, [course, parseMD, language]);

  if (course === "scratch") {
    const lessonContent = renderScratchBlocks(parseMD);
    return <div className="PreviewArea" dangerouslySetInnerHTML={{ __html: lessonContent }} />;
  } else {
    return <div className="PreviewArea" dangerouslySetInnerHTML={{ __html: parseMD }} />;
  }
};

export default MDPreview;
