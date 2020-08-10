const paths = require("../paths");
const saveFile = require("../utils/save-file");
const loadFile = require("../utils/load-file");

module.exports = (app) => {
  app.post(paths.LESSON_DATA, async (req, res) => {
    const { lessonId } = req.params;
    const buffer = Buffer.from(JSON.stringify(req.body));
    await saveFile(["drafts", lessonId, "data.json"], buffer);
    res.send("ok");
  });
  app.get(paths.LESSON_DATA, async (req, res) => {
    const { lessonId } = req.params;
    const content = await loadFile(["drafts", lessonId, "data.json"]);
    res.send(JSON.parse(content));
  });
};
