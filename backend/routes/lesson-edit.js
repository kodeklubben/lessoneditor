const getContent = require("../githubAPI/getRepoContent");
const saveFile = require("../utils/save-file");
const updateUserLessons = require("../utils/update-user-lessons");
const axios = require("axios");
const downloadImage = require("../utils/download-image");
const isLessonSaved = require("../utils/is-lesson-saved");
const nanoid = require("nanoid").customAlphabet(
  "01234567890abcdefghijklmnopqrstuvwxyz",
  7
);
const imgRegex = /([a-zA-Z0-9\s_\\.\-:])+(.png|.jpeg|.jpg)$/i;

module.exports = (app) => {
  app.get("/api/lesson/edit/:course/:lesson/:file", async (req, res) => {
    const { course, lesson, file } = req.params;
    const savedLesson = await isLessonSaved(req.user.username, course, lesson);
    if (savedLesson) {
      res.status(200).send({
        redirect: `/api/lesson/edit/${savedLesson}/${file}`,
      });
    } else {
      const path = `src/${course}/${lesson}`;
      const files = await getContent(req.user.token, path);
      if (files) {
        const data = Object.assign({}, req.body);
        data.lessonId = nanoid();
        data.created = new Date().toISOString();
        data.updated = new Date().toISOString();
        data.createdBy = req.user.username;
        const dataBuffer = Buffer.from(JSON.stringify(data));
        await saveFile(["drafts", data.lessonId, "data.json"], dataBuffer);
        await updateUserLessons(
          data.lessonId,
          course,
          lesson,
          req.user.username
        );
        for (const i in files.data) {
          if (files.data[i].name.match(imgRegex)) {
            const imageBuffer = await downloadImage(files.data[i].download_url);
            await saveFile(
              ["drafts", data.lessonId, files.data[i].name],
              imageBuffer
            );
          } else {
            const fileBuffer = await axios.get(files.data[i].download_url);
            await saveFile(
              ["drafts", data.lessonId, files.data[i].name],
              Buffer.from(fileBuffer.data)
            );
          }
        }
        res.status(200).send({
          redirect: `/api/lesson/edit/${data.lessonId}/${file}`,
        });
      } else {
        res.send("Error");
      }
    }
  });
};
