const loadFile = require("./load-file");
const saveFile = require("./save-file");

module.exports = async (data, username, edit = false) => {
  let buffer;
  if (edit) {
    const lessons = await loadFile(["users", username, "lessons.json"]);
    let newLessons = [];
    if (lessons) {
      newLessons = JSON.parse(lessons);
      newLessons.push(data);
    } else {
      newLessons.push(data);
    }
    buffer = Buffer.from(JSON.stringify(newLessons));
  } else {
    buffer = Buffer.from(JSON.stringify(data));
  }
  await saveFile(["users", username, "lessons.json"], buffer);
};
