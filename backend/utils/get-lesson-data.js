const loadFile = require("../utils/load-file");
const listFiles = require("../utils/list-files");
const getMetaData = require("../utils/get-meta-data.mock");
const yaml = require("js-yaml");

// Todo: Check for empty fileList
module.exports = async (lessonId) => {
  const fileList = await listFiles(["drafts", lessonId]);
  const lessonData = { meta: { lessonId: lessonId } };
  const lessonFiles = [];
  for (let i in fileList) {
    if (fileList[i].filename === "preview.png") {
      continue;
    }
    if (fileList[i].filename === "data.json") {
      const metadata = JSON.parse(
        await loadFile(["drafts", lessonId, fileList[i].filename])
      );
      lessonData.meta.course = metadata.course;
      lessonData.meta.title = metadata.lesson;
      const data = {};
      data.ext = "yml";
      data.filename = "lesson";
      data.content = yaml.safeDump(metadata.yml, { flowLevel: 2 });
      lessonFiles.push(data);
      continue;
    }
    const data = {};
    data.ext = fileList[i].filename.split(".").pop();
    data.filename = fileList[i].filename;
    data.content = await loadFile(["drafts", lessonId, data.filename]);
    lessonFiles.push(data);
  }
  lessonData.files = lessonFiles;
  return lessonData;
};
