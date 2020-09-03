const getContent = require("../githubAPI/getRepoContent");
const upsertUserLessons = require("../lesson/upsert-user-lessons");
const isLessonSaved = require("../lesson/is-lesson-saved");
const createNewLesson = require("../lesson/create-lesson-data");
const baseUrl = require("../utils/base-url");
const saveFetchedFile = require("../lesson/save-fetched-lesson-file");
// Todo: Refactor, finne bedre løsning på resolve markdown urls.
module.exports = (app) => {
  app.get("/api/lesson/edit/:course/:lesson/:filename", async (req, res) => {
    const { course, lesson, filename } = req.params;
    const savedLesson = await isLessonSaved(req.user.username, course, lesson);
    if (savedLesson) {
      res.redirect(`/editor/${savedLesson}/${filename}`);
    } else {
      const files = await getContent([course, lesson]);
      if (files) {
        const lessonData = await createNewLesson(
          { course: course, lesson: lesson },
          req.user.username,
          true
        );
        await upsertUserLessons(
          {
            lessonId: lessonData.lessonId,
            course: course,
            lesson: lesson,
            title: "",
          },
          req.user.username,
          true
        );
        const base = baseUrl(req);
        for (const i in files.data) {
          await saveFetchedFile(lessonData.lessonId, files.data[i], base);
        }
        res.redirect(`/editor/${lessonData.lessonId}/${filename}`);
      } else {
        res.send("Error");
      }
    }
  });
};
