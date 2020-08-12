import paths from "../paths.json";
import axios from "axios";

export default async (data) => {
  const result = await axios.post(paths.LESSON, data);
  return result.data.lessonId;
};
