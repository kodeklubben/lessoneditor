const paths = require("../paths");
const loadFile = require("../utils/load-file");
const upsertUserLessons = require("../utils/upsert-user-lessons");
const resolveUrlTemplate = require("../utils/resolve-url-template");
module.exports = (app) => {
  app.post(paths.USER_LESSONS, async (req, res) => {
    await upsertUserLessons(req.body, req.user.username);
    res.send("ok");
  });
  app.get(paths.USER_LESSONS, async (req, res) => {
    try {
      const result = await loadFile([
        "users",
        req.user.username,
        "lessons.json",
      ]);
      if (result) {
        const lessons = JSON.parse(result);
        lessons.forEach(
          (lesson) =>
            (lesson.thumb = resolveUrlTemplate(paths.DISPLAY_FILE, {
              lessonId: lesson.lessonId,
              file: "preview.png",
            }))
        );
        res.send(lessons);
      } else {
        res.send([]);
      }
    } catch (e) {
      if (e.response.status === 404) {
        res.send([]);
      } else {
        res.send(e.message);
      }
    }
  });
};
