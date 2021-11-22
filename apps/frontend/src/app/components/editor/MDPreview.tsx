import "./mdpreview.scss";
import { FC, useEffect, useState } from "react";
import { renderMicrobit } from "../../utils/renderMicrobit";
import { renderScratchBlocks } from "../../utils/renderScratchblocks";
import { mdParser } from "../../utils/mdParser";
import { useLessonContext } from "../../contexts/LessonContext";
import axios, { AxiosResponse } from "axios";
import { paths } from "@lessoneditor/api-interfaces";

import blobUtil from "blob-util";

interface MDPreviewProps {
  mdText: string;
  course: string;
  language: string;
}

const MDPreview: FC<MDPreviewProps> = ({ mdText, course, language }) => {
  const { state, images } = useLessonContext();

  const [mdTextUrlReplaced, setMdTextUrlReplaced] = useState<string>("");
  const parseMD = mdTextUrlReplaced && mdParser(mdTextUrlReplaced);

  useEffect(() => {
    console.log(images);
    function replaceUrlWithBase64(markdownContent: any) {
      const filenames: string[] = [];
      markdownContent.replace(
        /(!\[.*?\]\(")(.+?)("\))/gs,
        function (whole: string, prefix: string, imagePathRaw: string, postfix: string) {
          filenames.push(imagePathRaw);
        }
      );
      return markdownContent.replace(
        /(!\[.*?\]\()(.+?)(\))/gs,
        function (whole: string, prefix: string, imagePathRaw: string, postfix: string) {
          imagePathRaw = imagePathRaw.slice(1, -1);
          const filename: string = filenames.shift() ?? "";
          const imageBlob = images[filename];
          return prefix + imageBlob + postfix;
        }
      );
    }

    async function replaceUrls() {
      const newMdText = replaceUrlWithBase64(mdText);
      setMdTextUrlReplaced(newMdText);
    }
    replaceUrls();

    if (course === "microbit") {
      renderMicrobit(language);
    }
  }, [mdText, images]);

  if (course === "scratch" && parseMD) {
    const lessonContent = renderScratchBlocks(parseMD);
    return <div className="preview-area" dangerouslySetInnerHTML={{ __html: lessonContent }} />;
  } else {
    return <div className="preview-area" dangerouslySetInnerHTML={{ __html: parseMD }} />;
  }
};

export default MDPreview;
