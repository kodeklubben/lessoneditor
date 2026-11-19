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

  useEffect(() => {
    if (course !== "scratch") {
      return;
    }
    const timeoutHandler = setTimeout(() => {
      const returnContent = renderScratchBlocks(parsedMDwithUpdatedImageURLS);

      setSvgContent(returnContent);
    }, 300);

    return () => {
      clearTimeout(timeoutHandler);
    };
  }, [parsedMDwithUpdatedImageURLS]);

  useEffect(() => {
    if (course === "microbit") {
      renderMicrobit(language);
    }
  }, [parsedMDwithUpdatedImageURLS]);

  if (course === "scratch" && parsedMDwithUpdatedImageURLS) {
    const lessonContent = renderScratchBlocks(svgContent);
    return (
      <div
        className={`preview-area ${preview ? "preview" : ""}`}
        dangerouslySetInnerHTML={{ __html: sanitizeLessonHtml(lessonContent) }}
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
