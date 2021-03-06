const loadFile = require("../storage/load-file");

async function loadUserLessons(username) {
  const userLessons = await loadFile(["users", username, "lessons.json"]);
  return JSON.parse(userLessons);
}
module.exports = loadUserLessons;
