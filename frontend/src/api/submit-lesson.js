import paths from "../paths.json";
import axios from "axios";
import resolveUrlTemplate from "../utils/resolve-url-template";

export default async (lessonId) => {
  const tempFileUrl = resolveUrlTemplate(paths.LESSON_SUBMIT, {
    lessonId,
  });
  await axios.post(tempFileUrl);
};
