import { paths } from "@lessoneditor/api-interfaces";
import { NewLessonDTO } from "@lessoneditor/contracts";
import axios from "axios";

const createLesson = async (userId: number, data: NewLessonDTO) => {
  const url = paths.USER + "/" + userId + "/lesson";
  const result: any = await axios.post(url, data);
  return result.data.lessonId;
};

export default createLesson;
