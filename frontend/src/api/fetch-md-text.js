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
    await axios.get(tempFileUrl + ".md").then((result) => {
      mdText = result.data;
    });
  } catch (e) {
    console.error("No tempFile Found");
  }
  return mdText;
};
