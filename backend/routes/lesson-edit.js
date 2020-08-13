const getContent = require("../githubAPI/getRepoContent");
const saveFile = require("../utils/save-file");
const axios = require("axios");
const downloadImage = require("../utils/download-image");
const nanoid = require("nanoid").customAlphabet(
  "01234567890abcdefghijklmnopqrstuvwxyz",
  7
);
const imgRegex = /([a-zA-Z0-9\s_\\.\-:])+(.png|.jpeg|.jpg)$/i;

module.exports = (app) => {
  app.post("/api/lesson/edit/:course/:lesson/:file", async (req, res) => {
    const { course, lesson, file } = req.params;
    const path = `src/${course}/${lesson}`;
    const files = await getContent(req.user.token, path);
    if (files) {
      const data = Object.assign({}, req.body);
      data.lessonId = nanoid();
      data.created = new Date().toISOString();
      data.updated = new Date().toISOString();
      data.createdBy = req.user.username;
      const buffer = Buffer.from(JSON.stringify(data));
      await saveFile(["drafts", data.lessonId, "data.json"], buffer);
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
        redirect: `localhost:3232/api/lesson/edit/${data.lessonId}/${file}`,
      });
    } else {
      res.send("Error");
    }
  });
};
