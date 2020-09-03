const loadFile = require("../storage/load-file");
const saveFile = require("../storage/save-file");

module.exports = async (data, username, edit = false) => {
  let buffer;
  if (!edit) {
    buffer = Buffer.from(JSON.stringify(data));
  } else {
    const lessons = await loadFile(["users", username, "lessons.json"]);
    let newLessons;
    if (!lessons) {
      newLessons = [data];
    } else {
      newLessons = JSON.parse(lessons);
      newLessons.push(data);
    }
    buffer = Buffer.from(JSON.stringify(newLessons));
  }
  await saveFile(["users", username, "lessons.json"], buffer);
};
