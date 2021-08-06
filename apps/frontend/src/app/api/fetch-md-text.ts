import { paths, resolveUrlTemplate } from "@lessoneditor/api-interfaces";
import axios from "axios";


const fetchMdText = async (lessonId: any, file: any) => {
  let mdText = "";
  try {
    const tempFileUrl = resolveUrlTemplate(paths.DISPLAY_FILE, {
      lessonId,
      file
    });
    const result = await axios.get(tempFileUrl + ".md");
    mdText = result.data;
  } catch (e) {
    console.error("No tempFile Found");
  }
  return mdText;
};

export default fetchMdText;
