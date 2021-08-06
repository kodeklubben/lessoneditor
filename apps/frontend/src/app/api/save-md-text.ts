import { paths, resolveUrlTemplate } from "@lessoneditor/api-interfaces";
import axios from "axios";

const saveMdText = async (
  lessonId: string,
  file: string,
  mdText: string,
  regenThumb?: boolean
) => {
  const tempFileUrl = resolveUrlTemplate(paths.DISPLAY_FILE, {
    lessonId,
    file
  });
  await axios.post(tempFileUrl + ".md", mdText, {
    headers: {
      "Content-Type": "text/plain"
    },
    params: {
      regenThumb
    }
  });
};

export default saveMdText;
