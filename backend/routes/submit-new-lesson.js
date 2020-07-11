const paths = require("../paths");
const submit = require("../githubAPI/submitLesson");

module.exports = (app) => {
  app.post(paths.LESSON_SUBMIT_NEW, (res, req) => {
    try {
      const lessonData = axios.get(paths.LESSON_DATA);
      const token = getToken();
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
