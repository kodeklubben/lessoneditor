const paths = require("../paths");
const saveFile = require("../utils/save-file");
const loadFile = require("../utils/load-file");

module.exports = (app) => {
  app.post(paths.LESSON_DATA, async (req, res) => {
    const { username } = req.user;
    const { course, lesson } = req.params;
    const buffer = Buffer.from(JSON.stringify(req.body));
    await saveFile([username, course, lesson, "data.json"], buffer);
    res.send("ok");
  });
  app.get(paths.LESSON_DATA, async (req, res) => {
    const { username } = req.user;
    const { course, lesson } = req.params;
    const content = await loadFile([username, course, lesson, "data.json"]);
    res.send(JSON.parse(content));
  });
};
