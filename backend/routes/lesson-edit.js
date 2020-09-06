const getContent = require("../githubAPI/getRepoContent");
const saveFile = require("../storage/save-file");
const upsertUserLessons = require("../lesson/upsert-user-lessons");
const axios = require("axios");
const downloadImage = require("../storage/download-image");
const isLessonSaved = require("../lesson/is-lesson-saved");
const createNewLesson = require("../lesson/create-lesson-data");
const paths = require("../paths");
const imgRegex = /([a-zA-Z0-9\s_\\.\-:])+(.png|.jpeg|.jpg)$/i;
const mdRegex = /([a-zA-Z0-9\s_\\.\-:])+(.md)$/i;
const yamlRegex = /([a-zA-Z0-9\s_\\.\-:])+(.yml)$/i;
const isAppEngine = require("../utils/isAppEngine");
const resolveMarkdownUrls = require("../utils/resolve-markdown-urls");
const yaml = require("js-yaml");

const languages = ["_nn", "_en", "_is"];

// Todo: Refactor, finne bedre løsning på resolve markdown urls.
module.exports = (app) => {
  app.get("/api/lesson/edit/:course/:lesson/:filename", async (req, res) => {
    const { course, lesson, filename } = req.params;
    const savedLesson = await isLessonSaved(req.user.username, course, lesson);
    if (savedLesson) {
      const redirectUrl = `/editor/${savedLesson}/${
        languages.includes(filename.slice(-3))
          ? `${filename.slice(0, -3)}/${filename.slice(-2)}`
          : `${filename}/nb`
      }`;
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
            title: "",
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
          } else if (files.data[i].name.match(mdRegex)) {
            const file = await axios.get(files.data[i].download_url);
            let resolvedFile;
            if (isAppEngine()) {
              resolvedFile = resolveMarkdownUrls(
                file.data,
                `https://lessoneditor.ew.r.appspot.com/api/display/${lessonData.lessonId}/`
              );
            } else {
              resolvedFile = resolveMarkdownUrls(
                file.data,
                `http://localhost:3232/api/display/${lessonData.lessonId}/`
              );
            }
            await saveFile(
              ["drafts", lessonData.lessonId, files.data[i].name],
              Buffer.from(resolvedFile)
            );
          } else if (files.data[i].name.match(yamlRegex)) {
            const file = await axios.get(files.data[i].download_url);
            const ymlBuffer = Buffer.from(
              JSON.stringify(yaml.safeLoad(file.data))
            );
            await saveFile(
              ["drafts", lessonData.lessonId, files.data[i].name],
              ymlBuffer
            );
          } else {
            const file = await axios.get(files.data[i].download_url);
            await saveFile(
              ["drafts", lessonData.lessonId, files.data[i].name],
              Buffer.from(file.data)
            );
          }
        }
        const redirectUrl = `/editor/${savedLesson}/${
          languages.includes(filename.slice(-3))
            ? `${filename.slice(0, -3)}/${filename.slice(-2)}`
            : `${filename}/nb`
        }`;
        res.redirect(redirectUrl);
      } else {
        res.send("Error");
      }
    }
  });
};
