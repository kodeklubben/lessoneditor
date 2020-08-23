import paths from "../paths.json";
import axios from "axios";

export default async (lessonId) => {
  console.log(`submit lesson id : ${lessonId}`);
  await axios.post(paths.LESSON_SUBMIT, {
    params: {
      lessonId,
    },
  });
};
