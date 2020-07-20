const paths = require("../paths");
const listFiles = require("../utils/list-files");
module.exports = (app) => {
  app.get(paths.LESSON_FILES, async (req, res) => {
    const { username } = req.user;
    const { course, lesson } = req.params;
    const files = await listFiles([username, course, lesson]);
    res.send(files);
  });
};
