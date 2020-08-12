import paths from "../paths.json";
import axios from "axios";
import resolveUrlTemplate from "../utils/resolve-url-template";

export default async (lessonId, file, mdText, regenThumb) => {
  const tempFileUrl = resolveUrlTemplate(paths.DISPLAY_FILE, {
    lessonId,
    file,
  });
  await axios.post(tempFileUrl + ".md", mdText, {
    headers: {
      "Content-Type": "text/plain",
    },
    params: {
      regenThumb,
    },
  });
};
