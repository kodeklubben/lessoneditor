import resolveUrlTemplate from "../utils/resolve-url-template";
import paths from "../../paths.json";
import axios from "axios";

const uploadImage = async (lessonId: string, file: any) => {
  const formData = new FormData();
  formData.append("file", file);
  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };
  const uploadUrl = resolveUrlTemplate(paths.LESSON_UPLOADS, { lessonId });
  const result = await axios.post(uploadUrl, formData, config);
  return result.data;
};

export default uploadImage;
