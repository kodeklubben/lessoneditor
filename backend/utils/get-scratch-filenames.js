const listFiles = require("../lesson/list-files");

module.exports = async () => {
  const files = await listFiles(["bilder"]);
  let fileNames = [];
  for (const file of files) {
    fileNames.push(file.filename);
  }
  return fileNames;
};
