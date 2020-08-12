const paths = require("../paths");
const baseUrl = require("../utils/base-url");
const thumbRefresh = require("../utils/thumb-refresh");

module.exports = (app) => {
  app.get(paths.LESSON_THUMB, async (req, res) => {
    const { lessonId, file } = req.params;
    try {
      const thumbUrl = await thumbRefresh(baseUrl(req), lessonId, file);
      res.status(201).send(thumbUrl);
    } catch (e) {
      res.status(501).send(e.message);
    }
  });
};
