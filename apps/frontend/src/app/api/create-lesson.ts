import paths from "../../paths.json";
import axios from "axios";

const createLesson = async (data: any) => {
  const result = await axios.post(paths.LESSON, data);
  return result.data.lessonId;
};

export default createLesson;
