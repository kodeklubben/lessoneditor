import "./mdpreview.scss";
import "./mdpreviewarea.scss";
import { FC, useEffect, useState } from "react";
import { renderMicrobit } from "../../utils/renderMicrobit";
import { renderScratchBlocks } from "../../utils/renderScratchblocks";
import { mdParser } from "../../utils/mdParser";
import { sanitizeLessonHtml } from "../../utils/sanitizeHtml";
import { replaceLocalImageUrls } from "../../utils/localImages";
import { useLessonContext } from "../../contexts/LessonContext";
import ContentPlaceholder from "./ContentPlaceholder";

interface MDPreviewProps {
  mdText: string;
  course: string;
  language: string;
  preview: boolean;
  lineNumber?: number;
}

const MDPreviewArea: FC<MDPreviewProps> = ({ mdText, course, language, preview, lineNumber }) => {
  const { images } = useLessonContext();

  const [svgContent, setSvgContent] = useState<string>("");

  const [parsedMDwithUpdatedImageURLS, setParsedMDwithUpdatedImageURLS] = useState<string>("");

  useEffect(() => {
    function scrollToLine(lineNumber: number) {
      const element = document.getElementById(`line-${lineNumber}`);
      if (element) {
        const container = document.querySelector(".preview-area");
        if (container) {
          const containerHeight = container.clientHeight;
          const elementHeight = element.clientHeight;
          //@ts-ignore
          const elementTop = element.offsetTop - container.offsetTop;
          const scrollPosition = elementTop - containerHeight / 2 + elementHeight / 2;
          // @ts-ignore
          container.scrollTo({ top: scrollPosition, behavior: "smooth" });
        }
      }
    }
    scrollToLine((lineNumber ?? 1) - 1);
  }, [lineNumber]);

  useEffect(() => {
    async function replaceUrls() {
      const newMdText = replaceLocalImageUrls(mdText, images);
      setParsedMDwithUpdatedImageURLS(mdParser(newMdText));
    }
    replaceUrls();
  }, [mdText, images]);

  // Scratch blocks are drawn once per change, 300 ms after typing stops. Before, the result was
  // run through scratchblocks again on every render.
  useEffect(() => {
    if (course !== "scratch") {
      return;
    }
    const timeoutHandler = setTimeout(() => {
      setSvgContent(renderScratchBlocks(parsedMDwithUpdatedImageURLS));
    }, 300);

    return () => {
      clearTimeout(timeoutHandler);
    };
  }, [parsedMDwithUpdatedImageURLS, course]);

  useEffect(() => {
    if (course === "microbit") {
      renderMicrobit(language);
    }
  }, [parsedMDwithUpdatedImageURLS, course, language]);

  if (course === "scratch" && parsedMDwithUpdatedImageURLS) {
    return (
      <div
        className={`preview-area ${preview ? "preview" : ""}`}
        // Empty until the blocks are drawn, so the thumbnailer never photographs raw block code.
        dangerouslySetInnerHTML={{ __html: sanitizeLessonHtml(svgContent) }}
      />
    );
  } else if (!parsedMDwithUpdatedImageURLS && mdText !== "") {
    return (
      <div className={`preview-area ${preview ? "preview" : ""}`}>
        <ContentPlaceholder />
      </div>
    );
  } else {
    return (
      <div
        className={`preview-area ${preview ? "preview" : ""}`}
        dangerouslySetInnerHTML={{ __html: sanitizeLessonHtml(parsedMDwithUpdatedImageURLS) }}
      />
    );
  }
};

export default MDPreviewArea;
