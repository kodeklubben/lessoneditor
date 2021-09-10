import thumbFetch from "./thumb-fetch";

const path = require("path");
const thumbRefresh = async (baseUrl, lessonId, file) => {
  const filename = path.parse(file).name;
  const previewurl = [baseUrl, "preview", lessonId, filename].join("/");
  const storagePath = ["drafts", lessonId, "preview.png"];
  const start = Date.now();
  const url = await thumbFetch(previewurl, storagePath);
  console.log("Thumb refresh took", Date.now() - start, "ms");
  return url;
};

export default thumbRefresh;
