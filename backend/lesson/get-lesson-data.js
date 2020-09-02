const loadFile = require("../storage/load-file");
const listFiles = require("./list-files");

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
