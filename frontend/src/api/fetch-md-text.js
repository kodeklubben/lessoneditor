import paths from "../paths.json";
import axios from "axios";
import resolveUrlTemplate from "../utils/resolve-url-template";

export default async (course, lesson, file) => {
  let mdText = "";
  try {
    const tempFileUrl = resolveUrlTemplate(paths.DISPLAY_FILE, {
      course,
      lesson,
      file,
    });
    const result = await axios.get(tempFileUrl + ".md");
    mdText = result.data;
  } catch (e) {
    console.log("No tempFile Found");
    try {
      const proxyUrl = ["/api/lessons-proxy", course, lesson, file].join("/");
      const result = await axios.get(proxyUrl);
      mdText = result.data;
    } catch (e) {
      console.log("No proxy-text found.");
    }
  }
  return mdText;
};
