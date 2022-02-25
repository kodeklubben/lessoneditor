import "./mdpreview.scss";
import { FC, useEffect, useState } from "react";
import { renderMicrobit } from "../../utils/renderMicrobit";
import { renderScratchBlocks } from "../../utils/renderScratchblocks";
import { mdParser } from "../../utils/mdParser";
import { useLessonContext } from "../../contexts/LessonContext";
import ContentPlaceholder from "./ContentPlaceholder";
import md5 from "crypto-js/md5";

interface MDPreviewProps {
  mdText: string;
  course: string;
  language: string;
}

let storeSVG = {};

const MDPreview: FC<MDPreviewProps> = ({ mdText, course, language }) => {
  const { images } = useLessonContext();

  const [svgTest, setSvgTest] = useState<any>("");

  const [parsedMDwithUpdatedImageURLS, setParsedMDwithUpdatedImageURLS] = useState<string>("");

  useEffect(() => {
    if (course === "microbit") {
      renderMicrobit(language);
    }
  }, [mdText]);

  useEffect(() => {
    if (course !== "scratch") {
      return;
    }
    const timeoutHandler = setTimeout(async () => {
      function replaceScratchBlocksWithSVG() {
        const replace = {
          start: '<pre><code class="blocks">',
          end: "</code></pre>",
        };
        let returnContent = parsedMDwithUpdatedImageURLS;
        const re = new RegExp(replace.start + "[\\s\\S]*?" + replace.end, "g");
        let blocks = parsedMDwithUpdatedImageURLS.match(re);
        if (blocks) {
          blocks.forEach((block: any) => {
            let code = block.substring(replace.start.length, block.length - replace.end.length);
            const checksum = md5(code).toString();
            if (checksum in storeSVG) {
              // @ts-ignore
              returnContent = returnContent.replace(block, storeSVG[checksum]);
              setSvgTest(returnContent);
            } else {
              returnContent = renderScratchBlocks(parsedMDwithUpdatedImageURLS);
              const test = returnContent.slice(
                returnContent.indexOf("<svg"),
                returnContent.indexOf("</svg>") + "</svg>".length
              );
              // @ts-ignore
              storeSVG[checksum] = test;
              setSvgTest(returnContent);
            }
          });
        } else {
          setSvgTest(returnContent);
        }
      }

      replaceScratchBlocksWithSVG();
    }, 250);
    return () => {
      clearTimeout(timeoutHandler);
    };
  }, [parsedMDwithUpdatedImageURLS]);

  useEffect(() => {
    function replaceUrlWithBlobUrl(markdownContent: any) {
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
      const newMdText = replaceUrlWithBlobUrl(mdText);
      setParsedMDwithUpdatedImageURLS(mdParser(newMdText));
    }
    replaceUrls();
  }, [mdText]);

  if (course === "scratch" && parsedMDwithUpdatedImageURLS) {
    const lessonContent = renderScratchBlocks(svgTest);
    return <div className="preview-area" dangerouslySetInnerHTML={{ __html: lessonContent }} />;
  } else if (!parsedMDwithUpdatedImageURLS && mdText !== "") {
    return (
      <div className="preview-area">
        <ContentPlaceholder />
      </div>
    );
  } else {
    return (
      <div
        className="preview-area"
        dangerouslySetInnerHTML={{ __html: parsedMDwithUpdatedImageURLS }}
      />
    );
  }
};

export default MDPreview;
