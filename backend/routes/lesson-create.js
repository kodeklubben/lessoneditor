const paths = require("../paths");
const thumbRefresh = require("../utils/thumb-refresh");
const baseUrl = require("../utils/base-url");
const createNewLesson = require("../utils/create-lesson-data");

module.exports = (app) => {
  app.post(paths.LESSON, async (req, res) => {
    const data = await createNewLesson(req.body, req.user.username);
    await thumbRefresh(baseUrl(req), data.lessonId, data.lesson);
    res.send(data);
  });
};
