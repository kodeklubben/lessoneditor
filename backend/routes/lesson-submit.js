const paths = require("../paths");
const submit = require("../githubAPI/submitLesson");
const token = "xxx"; //need to find token.

module.exports = (app) => {
  app.post(paths.LESSON_SUBMIT, (req, res) => {
    try {
      const lessonData = axios.get(paths.LESSON_DATA);
      const submitRes = submit(lessonData, token);
      if (submitRes) {
        res.send("OK");
      }
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
