const getRepoContent = require("../githubAPI/getRepoContent");
const saveFile = require("../storage/save-file");
const addUserLesson = require("../lesson/add-user-lesson");
const axios = require("axios");
const downloadImage = require("../storage/download-image");
const isLessonSaved = require("../lesson/is-lesson-saved");
const createLessonData = require("../lesson/create-lesson-data");
const paths = require("../paths");
const imgRegex = /([a-zA-Z0-9\s_\\.\-:])+(.png|.jpeg|.jpg|.gif)$/i;
const mdRegex = /([a-zA-Z0-9\s_\\.\-:])+(.md)$/i;
const yamlRegex = /([a-zA-Z0-9\s_\\.\-:])+(.yml)$/i;
const parseLessonFilename = require("../utils/parse-lesson-filename");
const resolveMarkdownUrls = require("../utils/resolve-markdown-urls");
const yaml = require("js-yaml");

// Todo: Refactor, finne bedre løsning på resolve markdown urls.
module.exports = (app) => {
  app.post("/not-implemented", async (req, res) => {
    const { course, lesson, filename } = req.params;
    const savedLessonId = await isLessonSaved(
      req.user.username,
      course,
      lesson
    );
    if (!savedLessonId) {
      const files = await getRepoContent(`src/${course}/${lesson}`);
      if (!files || !files.data) {
        return res.send("Error");
      }
      const lessonData = await createLessonData(
        { course: course, lesson: lesson },
        req.user.username
      );
      await addUserLesson(lessonData, req.user.username);
      for (const i in files.data) {
        if (files.data[i].name.match(imgRegex)) {
          const imageBuffer = await downloadImage(files.data[i].download_url);
          await saveFile(
            ["drafts", lessonData.lessonId, files.data[i].name],
            imageBuffer
          );
        } else if (files.data[i].name.match(mdRegex)) {
          const file = await axios.get(files.data[i].download_url);
          const resolvedFile = resolveMarkdownUrls(
            file.data,
            `/api/display/${lessonData.lessonId}/`
          );
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
    }
    const { basename, lanuage } = parseLessonFilename(filename);
    return res.redirect(`/editor/${savedLessonId}/${basename}/${lanuage}`);
  });
};
