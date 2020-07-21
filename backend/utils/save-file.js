const isAppEngine = require("./isAppEngine");
const saveToDisk = require("./save-to-disk");
const getTempDir = require("./get-temp-dir");
const constants = require("../constants.json");

module.exports = async (pathParts, buffer) => {
  if (isAppEngine()) {
    const filename = pathParts.join("/");
    await saveToGcs(filename, buffer, constants.BUCKET);
  } else {
    const filename = getTempDir(pathParts);
    await saveToDisk(filename, buffer);
  }
};
