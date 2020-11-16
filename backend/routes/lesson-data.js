const paths = require("../paths");
const saveFile = require("../storage/save-file");
const loadFile = require("../storage/load-file");

module.exports = (app) => {
  app.post(paths.LESSON_DATA, async (req, res) => {
    const { lessonId, filename } = req.params;
    const buffer = Buffer.from(JSON.stringify(req.body));
    saveFile(["drafts", lessonId, filename], buffer).then(res.send("ok"));
  });
  app.get(paths.LESSON_DATA, async (req, res) => {
    const { lessonId, filename } = req.params;
    loadFile(["drafts", lessonId, filename]).then((content) => {
      res.send(JSON.parse(content));
    });
  });
};
