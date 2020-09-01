const paths = require("../paths");
const listFiles = require("../lesson/list-files");
module.exports = (app) => {
  app.get(paths.LESSON_FILES, async (req, res) => {
    const { lessonId } = req.params;
    const files = await listFiles(["drafts", lessonId]);
    res.send(files);
  });
};
