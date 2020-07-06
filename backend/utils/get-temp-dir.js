const os = require("os");
const path = require("path");
const sessionTmpDir = os.tmpdir();
module.exports = (folders) => {
  folders.unshift(sessionTmpDir);
  const targetDir = folders.join(path.sep);
  return targetDir;
};
