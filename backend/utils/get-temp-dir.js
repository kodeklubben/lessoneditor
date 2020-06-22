const os = require("os");
const path = require("path");
const sessionTmpDir = os.tmpdir();
module.exports = (folder) => {
  return sessionTmpDir + path.sep + folder;
};
