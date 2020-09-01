const thumbUrl = require("./thumb-url");
const saveFile = require("../storage/save-file");
const isAppEngine = require("../utils/isAppEngine");
const gcsUrl = require("../utils/gcs-url");
const downloadImage = require("../storage/download-image");
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
