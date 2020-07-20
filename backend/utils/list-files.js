const isAppEngine = require("./isAppEngine");
const { Storage } = require("@google-cloud/storage");
const constants = require("../constants.json");
const getTempDir = require("./get-temp-dir");
const gcsUrl = require("./gcs-url");
const path = require("path");
const storage = new Storage();
const fs = require("fs");
const paths = require("../paths");
const resolveUrlTemplate = require("./resolve-url-template");

module.exports = async (folders) => {
  const outFiles = [];
  if (isAppEngine()) {
    const bucket = storage.bucket(constants.BUCKET);
    const [files] = await bucket.getFiles({
      autoPaginate: false,
      prefix: folders.join("/"),
    });
    files.forEach((file) => {
      const { name, size, timeCreated, updated } = file.metadata;
      outFiles.push({
        filename: path.parse(name).base,
        url: gcsUrl(name, constants.BUCKET),
        size,
        created: timeCreated,
        updated,
      });
    });
  } else {
    const [username, course, lesson] = folders;
    const filesFolder = getTempDir(folders);
    if (fs.existsSync(filesFolder)) {
      fs.readdirSync(filesFolder).forEach((filename) => {
        const filePath = path.join(filesFolder, filename);
        const stats = fs.statSync(filePath);
        outFiles.push({
          filename,
          url: resolveUrlTemplate(paths.DISPLAY_FILE, {
            course,
            lesson,
            file: filename,
          }),
          size: stats.size,
          created: stats.ctime,
          updated: stats.mtime,
        });
      });
    }
  }
  return outFiles;
};
