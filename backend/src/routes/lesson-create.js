const paths = require("../paths");
const thumbRefresh = require("../thumb/thumb-refresh");
const baseUrl = require("../utils/base-url");
const createNewLesson = require("../lesson/create-lesson-data");

module.exports = (app) => {
  app.post(paths.LESSON, async (req, res) => {
    const data = await createNewLesson(req.body, req.user.username);
    const { lessonId, lesson } = data;
    console.debug("New lesson created", { lessonId, lesson });
    try {
      await thumbRefresh(baseUrl(req), lessonId, lesson);
    } catch (e) {
      console.error(e.message);
    }
    res.send(data);
  });
};
