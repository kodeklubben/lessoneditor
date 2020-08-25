const getContent = require("../githubAPI/getRepoContent");
const saveFile = require("../utils/save-file");
const upsertUserLessons = require("../utils/upsert-user-lessons");
const axios = require("axios");
const downloadImage = require("../utils/download-image");
const isLessonSaved = require("../utils/is-lesson-saved");
const createNewLesson = require("../utils/create-lesson-data");
const paths = require("../paths");
const imgRegex = /([a-zA-Z0-9\s_\\.\-:])+(.png|.jpeg|.jpg)$/i;

module.exports = (app) => {
  app.get("/api/lesson/edit/:course/:lesson/:filename", async (req, res) => {
    const { course, lesson, filename } = req.params;
    const savedLesson = await isLessonSaved(req.user.username, course, lesson);
    if (savedLesson) {
      const redirectUrl = `/editor/${savedLesson}/${filename}`;
      res.redirect(redirectUrl);
    } else {
      const path = `src/${course}/${lesson}`;
      const files = await getContent(path);
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
          },
          req.user.username,
          true
        );
        for (const i in files.data) {
          if (files.data[i].name.match(imgRegex)) {
            const imageBuffer = await downloadImage(files.data[i].download_url);
            await saveFile(
              ["drafts", lessonData.lessonId, files.data[i].name],
              imageBuffer
            );
          } else {
            const fileBuffer = await axios.get(files.data[i].download_url);
            await saveFile(
              ["drafts", lessonData.lessonId, files.data[i].name],
              Buffer.from(fileBuffer.data)
            );
          }
        }
        const redirectUrl = `/editor/${lessonData.lessonId}/${filename}`;
        res.redirect(redirectUrl);
      } else {
        res.send("Error");
      }
    }
  });
};
