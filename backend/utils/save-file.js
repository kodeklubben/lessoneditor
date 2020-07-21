const isAppEngine = require("./isAppEngine");
const saveToDisk = require("./save-to-disk");
const getTempDir = require("./get-temp-dir");

module.exports = async (pathParts, buffer) => {
  if (isAppEngine()) {
    const filename = pathParts.join("/");
    await saveToGcs(filename, buffer);
  } else {
    const filename = getTempDir(pathParts);
    await saveToDisk(filename, buffer);
  }
};
