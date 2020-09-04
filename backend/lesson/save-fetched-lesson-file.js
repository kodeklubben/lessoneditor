const axios = require("axios");
const downloadImage = require("../storage/download-image");
const saveFile = require("../storage/save-file");
const resolveMarkdownUrlsEdit = require("../utils/resolve-markdown-urls-edit");
const yaml = require("js-yaml");
const imgRegex = /([a-zA-Z0-9\s_\\.\-:])+(.png|.jpeg|.jpg)$/i;
const mdRegex = /([a-zA-Z0-9\s_\\.\-:])+(.md)$/i;
const yamlRegex = /([a-zA-Z0-9\s_\\.\-:])+(.yml)$/i;

module.exports = async (lessonId, fileData) => {
  if (fileData.name.match(imgRegex)) {
    const imageBuffer = await downloadImage(fileData.download_url);
    await saveFile(["drafts", lessonId, fileData.name], imageBuffer);
  } else {
    let bufferData;
    const file = await axios.get(fileData.download_url);
    if (fileData.name.match(mdRegex)) {
      bufferData = await resolveMarkdownUrlsEdit(file.data, lessonId);
    } else if (fileData.name.match(yamlRegex)) {
      bufferData = JSON.stringify(yaml.safeLoad(file.data));
    } else {
      bufferData = file.data;
    }
    const buffer = Buffer.from(bufferData);
    await saveFile(["drafts", lessonId, fileData.name], buffer);
  }
};
