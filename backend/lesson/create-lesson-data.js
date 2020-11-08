const saveFile = require("../storage/save-file");
const lessonInit = require("../utils/lesson-init");

module.exports = async (lessonData, username) => {
  const data = lessonInit(lessonData, username);
  if (false) {
    await saveFile(
      ["drafts", data.lessonId, data.lesson + ".md"],
      Buffer.from(" ")
    );
  }
  await saveFile(
    ["drafts", data.lessonId, "data.json"],
    Buffer.from(JSON.stringify(data))
  );
  await saveFile(["drafts", data.lessonId, "lesson.yml"], Buffer.from(""));
  return data;
};
