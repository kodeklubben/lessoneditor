const paths = require("../paths");
const saveFile = require("../utils/save-file");
const loadFile = require("../utils/load-file");

module.exports = (app) => {
  app.post(paths.LESSON_DATA, async (req, res) => {
    const { lessonId, filename } = req.params;
    const buffer = Buffer.from(JSON.stringify(req.body));
    await saveFile(["drafts", lessonId, filename], buffer);
    res.send("ok");
  });
  app.get(paths.LESSON_DATA, async (req, res) => {
    const { lessonId, filename } = req.params;
    const content = await loadFile(["drafts", lessonId, filename]);
    res.send(JSON.parse(content));
  });
};
