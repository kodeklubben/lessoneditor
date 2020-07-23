const getTempDir = require("./get-temp-dir");
const isAppEngine = require("./isAppEngine");
const saveToDisk = require("./save-to-disk");
const saveToGcs = require("./save-to-gcs");

module.exports = async (pathParts, buffer) => {
  if (isAppEngine()) {
    const filename = pathParts.join("/");
    await saveToGcs(filename, buffer);
  } else {
    const filename = getTempDir(pathParts);
    await saveToDisk(filename, buffer);
  }
};
