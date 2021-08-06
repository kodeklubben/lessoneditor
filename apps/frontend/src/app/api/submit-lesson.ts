import { paths, resolveUrlTemplate } from "@lessoneditor/api-interfaces";
import axios from "axios";


const submitLesson = async (lessonId: string) => {
  const tempFileUrl = resolveUrlTemplate(paths.LESSON_SUBMIT, {
    lessonId
  });
  await axios.post(tempFileUrl);
};

export default submitLesson;
