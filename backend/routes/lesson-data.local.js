const fs = require("fs");
const saveToDisk = require("../utils/save-to-disk");
const paths = require("../paths");

module.exports = (app) => {
  app.post(paths.LESSON_DATA, async (req, res) => {
    const { course, lesson } = req.params;
    const filename = getTempDir([course, lesson, "data.json"]);
    const content = JSON.stringify(req.body);
    await saveToDisk(filename, Buffer.from(content));
    res.send("ok");
  });
  app.get(paths.LESSON_DATA, async (req, res) => {
    const { course, lesson } = req.params;
    const filename = getTempDir([course, lesson, "data.json"]);
    const content = fs.readFileSync(filename, "utf8");
    res.send(JSON.parse(content));
  });
};
