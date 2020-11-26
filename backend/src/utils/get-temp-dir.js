const os = require("os");
const path = require("path");
const sessionTmpDir = os.tmpdir();
module.exports = (folders) => {
  const foldersClone = [...folders];
  foldersClone.unshift("lessoneditor");
  foldersClone.unshift(sessionTmpDir);
  return foldersClone.join(path.sep);
};
