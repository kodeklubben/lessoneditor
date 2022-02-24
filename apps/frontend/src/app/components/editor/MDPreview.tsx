import "./mdpreview.scss";
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
}

const MDPreview: FC<MDPreviewProps> = ({ mdText, course, language }) => {
  const { images } = useLessonContext();

  const [mdTextUrlReplaced, setMdTextUrlReplaced] = useState<string>("");
  const parseMD = mdTextUrlReplaced && mdParser(mdTextUrlReplaced);

  useEffect(() => {
    if (course === "microbit") {
      renderMicrobit(language);
    }
  }, [parseMD]);

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
      setMdTextUrlReplaced(newMdText);
    }
    replaceUrls();

    if (course === "microbit") {
      renderMicrobit(language);
    }
  }, [mdText]);

  if (course === "scratch" && parseMD) {
    const lessonContent = renderScratchBlocks(parseMD);
    return <div className="preview-area" dangerouslySetInnerHTML={{ __html: lessonContent }} />;
  } else if (!parseMD && mdText !== "") {
    return (
      <div className="preview-area">
        <ContentPlaceholder />
      </div>
    );
  } else {
    return <div className="preview-area" dangerouslySetInnerHTML={{ __html: parseMD }} />;
  }
};

export default MDPreview;
