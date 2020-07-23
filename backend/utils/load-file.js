const axios = require("axios");
const isAppEngine = require("./isAppEngine");
const getTempDir = require("./get-temp-dir");
const gcsUrl = require("./gcs-url");
const fs = require("fs");

module.exports = async (pathParts) => {
  if (isAppEngine()) {
    const filename = pathParts.join("/");
    const content = await axios.get(gcsUrl(filename));
    return content.data;
  } else {
    const filename = getTempDir(pathParts);
    if (fs.existsSync(filename)) {
      return fs.readFileSync(filename, "utf8");
    } else {
      return null;
    }
  }
};
