import "./mdpreview.scss";
import "./mdpreviewarea.scss";
import { FC, useEffect, useState } from "react";
import { renderMicrobit } from "../../utils/renderMicrobit";
import { renderScratchBlocks } from "../../utils/renderScratchblocks";
import { mdParser } from "../../utils/mdParser";
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
    scrollToLine(lineNumber! - 1 ?? 0);
  }, [lineNumber]);

  useEffect(() => {
    function replaceImageUrlWithBlobUrl(markdownContent: any) {
      if (!/(!\[.*?\])(\(\.\/.*?\))/.test(markdownContent)) {
        return markdownContent;
      }
      const filenames: string[] = [];
      markdownContent.replace(
        /(!\[.*?\])(\(\.\/.*?\))/gs,
        function (whole: string, prefix: string, imagePathRaw: string, postfix: string) {
          filenames.push(imagePathRaw.slice(3, -1));
        }
      );
      return markdownContent.replace(
        /(!\[.*?\]\()(.+?)(\))/gs,
        function (whole: string, prefix: string, imagePathRaw: string, postfix: string) {
          imagePathRaw = imagePathRaw.slice(2);
          const filename: string = filenames.shift() ?? "";
          const imageBlobUrl = images[filename];
          return prefix + imageBlobUrl + postfix;
        }
      );
    }

    async function replaceUrls() {
      const newMdText = replaceImageUrlWithBlobUrl(mdText);
      setParsedMDwithUpdatedImageURLS(mdParser(newMdText));
    }
    replaceUrls();
  }, [mdText]);

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
        dangerouslySetInnerHTML={{ __html: lessonContent }}
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
        dangerouslySetInnerHTML={{ __html: parsedMDwithUpdatedImageURLS }}
      />
    );
  }
};

export default MDPreviewArea;
