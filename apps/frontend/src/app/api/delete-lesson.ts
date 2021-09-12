import { paths } from "@lessoneditor/api-interfaces";
import { LessonDTO, NewLessonDTO } from "../../../../../libs/lesson/src/lib/lesson.dto"

import axios from "axios";

const deleteLesson = async (userId: number,lessonId: number) => {

  const url = paths.USER + "/" + userId + `/lesson?lessonId=${lessonId}`
  const result = await axios.delete<LessonDTO>(url);
  return result.data
};

export default deleteLesson;