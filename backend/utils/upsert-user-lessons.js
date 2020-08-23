const loadFile = require("./load-file");
const saveFile = require("./save-file");

module.exports = async (data, username) => {
  const lessons = await loadFile(["users", username, "lessons.json"]);
  if (lessons) {
    let newLessons = JSON.parse(lessons);
    newLessons.push(data);
    const buffer = Buffer.from(JSON.stringify(newLessons));
    await saveFile(["users", username, "lessons.json"], buffer);
  } else {
    const buffer = Buffer.from(JSON.stringify(data));
    await saveFile(["users", username, "lessons.json"], buffer);
  }
};
