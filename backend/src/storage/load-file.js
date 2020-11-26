const isAppEngine = require("../utils/isAppEngine");
const getTempDir = require("../utils/get-temp-dir");
const loadFileFromGcs = require("./load-file-gcs-to-string");
const fs = require("fs");

module.exports = async (pathParts) => {
  if (isAppEngine()) {
    try {
      const filename = pathParts.join("/");
      return await loadFileFromGcs(filename);
    } catch (e) {
      console.error(e.message);
      return null;
    }
  } else {
    const filename = getTempDir(pathParts);
    if (fs.existsSync(filename)) {
      return fs.readFileSync(filename, "utf8");
    } else {
      return null;
    }
  }
};
