const saveFile = require("../storage/save-file");
const lessonInit = require("../utils/lesson-init");

module.exports = async (lessonData, username, edit = false) => {
  const data = lessonInit(lessonData, username);
  const dataBuffer = Buffer.from(JSON.stringify(data));
  const ymlBuffer = Buffer.from(JSON.stringify({}));
  if (!edit) {
    await saveFile(
      ["drafts", data.lessonId, data.lesson + ".md"],
      Buffer.from(" ")
    );
  }
  await saveFile(["drafts", data.lessonId, "data.json"], dataBuffer);
  await saveFile(["drafts", data.lessonId, "lesson.yml"], ymlBuffer);
  return data;
};
