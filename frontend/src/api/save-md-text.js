import paths from "../paths.json";
import axios from "axios";
import resolveUrlTemplate from "../utils/resolve-url-template";

export default async (course, lesson, file, mdText) => {
  const tempFileUrl = resolveUrlTemplate(paths.DISPLAY_FILE, {
    course,
    lesson,
    file,
  });
  await axios.post(tempFileUrl + ".md", mdText, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
