const getTempDir = require("../utils/get-temp-dir");
const isAppEngine = require("../utils/isAppEngine");
const saveToDisk = require("./save-to-disk");
const saveToGcs = require("./save-to-gcs");
const paths = require("../paths");
module.exports = async (pathParts, buffer) => {
  const publicFilePath = pathParts.join("/");
  if (isAppEngine()) {
    return await saveToGcs(publicFilePath, buffer);
  } else {
    const filename = getTempDir(pathParts);
    await saveToDisk(filename, buffer);
    return paths.FILE.replace("*", publicFilePath);
  }
};
