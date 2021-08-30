import { paths } from "@lessoneditor/api-interfaces";
import axios from "axios";

const createLesson = async (data: {
  course: string;
  courseTitle: string;
  lesson: string;
  lessonTitle: string;
}) => {
  const result = await axios.post(paths.LESSON, data);
  return result.data.lessonId;
};

export default createLesson;
