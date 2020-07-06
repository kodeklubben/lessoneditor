const multer = require("../storage/multer");
const saveToGcs = require("../utils/save-to-gcs");
const paths = require("../paths");
const constants = require("../constants.json");
module.exports = (app) => {
  app.post(paths.LESSON_UPLOADS, multer.single("file"), async (req, res) => {
    if (!req.file) {
      res.status(400).send("No file uploaded.");
      return;
    }
    const { username } = req.user;
    const { course, lesson } = req.params;
    const fileInfo = req.file;
    fileInfo.imageUrl = await saveToGcs(
      [username, course, lesson, req.file.originalname].join("/"),
      req.file.buffer,
      constants.BUCKET
    );
    res.send(fileInfo);
  });
  app.delete(paths.LESSON_UPLOADS, (req, res, next) => {});
};
