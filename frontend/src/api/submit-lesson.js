import paths from "../paths.json";
import axios from "axios";
import resolveUrlTemplate from "../utils/resolve-url-template";

export default async (lessonId) => {
  await axios.post(paths.LESSON_SUBMIT, {
    params: {
      lessonId,
    },
  });
};
