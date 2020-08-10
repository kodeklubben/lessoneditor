import paths from "../paths.json";
import axios from "axios";
import resolveUrlTemplate from "../utils/resolve-url-template";

export default async (lessonId, file) => {
  let mdText = "";
  try {
    const tempFileUrl = resolveUrlTemplate(paths.DISPLAY_FILE, {
      lessonId,
      file,
    });
    const result = await axios.get(tempFileUrl + ".md");
    mdText = result.data;
  } catch (e) {
    console.log("No tempFile Found");
  }
  return mdText;
};
