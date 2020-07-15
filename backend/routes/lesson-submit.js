const paths = require("../paths");
const submit = require("../githubAPI/submitLesson");
const loadFile = require("../utils/load-file");

module.exports = (app) => {
  app.post(paths.LESSON_SUBMIT, async (req, res) => {
    try {
      const { username } = req.user;
      const { course, lesson } = req.params;
      const lessonData = loadFile([username, course, lesson, "data.json"]);
      const submitRes = submit(req.user.token, lessonData);
      if (submitRes) {
        res.send("OK");
      }
      res.send("Error", 500);
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
