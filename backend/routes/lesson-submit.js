const paths = require("../paths");
const submit = require("../githubAPI/submitLesson");
const getLessonData = require("../utils/get-lesson-data");

module.exports = (app) => {
  app.post(paths.LESSON_SUBMIT, async (req, res) => {
    try {
      const { username } = req.user;
      const { course, lesson } = req.params;
      const lessonData = await getLessonData(username, course, lesson);
      if (lessonData) {
        const submitRes = submit(req.user.token, lessonData);
        if (submitRes) {
          res.send("OK");
        }
      }
      res.status(500).send("Error");
    } catch (e) {
      if (e === 404) {
        console.log("Could not submit new lesson");
        return 404;
      } else {
        return e;
      }
    }
  });
};
