const paths = require("../paths");
const submit = require("../githubAPI/submitLesson");
const getLessonData = require("../lesson/get-lesson-data");

module.exports = (app) => {
  app.post(paths.LESSON_SUBMIT, async (req, res) => {
    try {
      const { lessonId } = req.params;
      const lessonData = await getLessonData(lessonId);
      if (lessonData) {
        const submitRes = await submit(req.user.token, lessonData);
        if (submitRes.status === 201) {
          res.status(201).send({
            message: "Pull Request Created",
            pullRequestURL: submitRes.data.html_url,
          });
        } else if (submitRes.status === 422) {
          res.status(200).send({
            message: "Pull Request exists, updated files",
            pullRequestUrl: `https://github.com/${process.env.GITHUB_LESSON_REPO_OWNER}/${process.env.GITHUB_LESSON_REPO}/pulls`,
          });
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
