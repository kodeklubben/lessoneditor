const saveFile = require("./save-file");
const nanoid = require("nanoid").customAlphabet(
  "01234567890abcdefghijklmnopqrstuvwxyz",
  7
);

module.exports = async (lessonData, username, edit = false) => {
  const data = Object.assign({}, lessonData);
  data.lessonId = nanoid();
  data.created = new Date().toISOString();
  data.updated = new Date().toISOString();
  data.createdBy = username;
  data.yml = Object.assign({}, "");
  const dataBuffer = Buffer.from(JSON.stringify(data));
  const ymlBuffer = Buffer.from(JSON.stringify({}));
  if (!edit) {
    await saveFile(
      ["drafts", data.lessonId, data.lesson + ".md"],
      Buffer.from("# " + data.title)
    );
  }
  await saveFile(["drafts", data.lessonId, "data.json"], dataBuffer);
  await saveFile(["drafts", data.lessonId, "lesson.yml"], ymlBuffer);
  return data;
};
