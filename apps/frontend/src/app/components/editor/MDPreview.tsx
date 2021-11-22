import "./mdpreview.scss";
import { FC, useEffect, useState } from "react";
import { renderMicrobit } from "../../utils/renderMicrobit";
import { renderScratchBlocks } from "../../utils/renderScratchblocks";
import { mdParser } from "../../utils/mdParser";
import { useLessonContext } from "../../contexts/LessonContext";
import axios, { AxiosResponse } from "axios";
import { paths } from "@lessoneditor/api-interfaces";

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
    async function replaceUrlWithBase64(markdownContent: any): Promise<string> {
      const promises: Promise<AxiosResponse<string>>[] = [];
      markdownContent.replace(
        /(!\[.*?\]\(")(.+?)("\))/gs,
        function (whole: string, prefix: string, imagePathRaw: string, postfix: string) {
          const promise = axios.get<string>(
            paths.LESSON_FILE.replace(":lessonId", state.lesson.lessonId.toString()).replace(
              ":fileName",
              imagePathRaw.split(".")[0]
            )
          );
          promises.push(promise);
        }
      );
      try {
        const data = await Promise.all(promises);
        return markdownContent.replace(
          /(!\[.*?\]\()(.+?)(\))/gs,
          function (whole: string, prefix: string, imagePathRaw: string, postfix: string) {
            imagePathRaw = imagePathRaw.slice(1, -1);
            let ext = imagePathRaw.split(".").pop();
            if (ext == "jpg") {
              ext = "jpeg";
            }
            return prefix + `data:image/${ext};base64,` + data.shift()?.data + postfix;
          }
        );
      } catch (error) {
        console.error(error);
        return "";
      }
    }

    async function replaceUrls() {
      const newMdText = await replaceUrlWithBase64(mdText);
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
  } else {
    return <div className="preview-area" dangerouslySetInnerHTML={{ __html: parseMD }} />;
  }
};

export default MDPreview;
