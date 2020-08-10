const loadFile = require("../utils/load-file");
const listFiles = require("../utils/list-files");
const getMetaData = require("../utils/get-meta-data.mock");
const yaml = require("js-yaml");

// Todo: Check for empty fileList
module.exports = async (lessonId) => {
  const fileList = await listFiles(["drafts", lessonId]);
  const lessonData = {};
  const lessonFiles = [];
  lessonData.meta = getMetaData(lessonId);
  for (let i in fileList) {
    if (fileList[i].filename === "data.json") {
      fileList.splice(i, 0);
      continue;
    }
    const data = {};
    data.ext = fileList[i].filename.split(".").pop();
    if (data.ext === "json") {
      data.ext = "yml";
      let filename = fileList[i].filename.split(".");
      filename.pop();
      data.filename = `${filename}.${data.ext}`;
      data.content = yaml.safeDump(
        JSON.parse(await loadFile(["drafts", lessonId, fileList[i].filename])),
        { flowLevel: 2 }
      );
    } else {
      data.filename = fileList[i].filename;
      data.content = await loadFile(["drafts", lessonId, data.filename]);
    }
    lessonFiles.push(data);
  }
  lessonData.files = lessonFiles;
  return lessonData;
};
