const axios = require("axios");
const isAppEngine = require("./isAppEngine");
const getTempDir = require("./get-temp-dir");
const { format } = require("util");
const constants = require("../constants.json");
const fs = require("fs");

module.exports = async (pathParts) => {
  if (isAppEngine()) {
    const filename = pathParts.join("/");
    const url = format(
      `${constants.GOOGLE_STORAGE_PREFIX}/${constants.BUCKET}/${filename}`
    );
    const content = await axios.get(url);
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
