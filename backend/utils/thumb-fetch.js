const thumbUrl = require("./thumb-url");
const saveFile = require("./save-file");
const isAppEngine = require("./isAppEngine");
const gcsUrl = require("./gcs-url");
const downloadImage = require("./download-image");
module.exports = async (previewUrl, storagePath) => {
  const url = thumbUrl(previewUrl);
  const imageBuffer = await downloadImage(url);
  await saveFile(storagePath, imageBuffer);
  if (isAppEngine()) {
    return gcsUrl(storagePath.join("/"));
  } else {
    storagePath.shift();
    return "/api/display/" + storagePath.join("/");
  }
};
