const multer = require("../storage/multer");
const saveToGcs = require("../utils/save-to-gcs");
const paths = require("../paths");
const fs = require("fs");
const constants = require("../constants.json");
const gcsUrl = require("../utils/gcs-url");
const getTempDir = require("../utils/get-temp-dir");
const isAppEngine = require("../utils/isAppEngine");
module.exports = (app) => {
  app.get(paths.DISPLAY_FILE, async (req, res) => {
    const { username } = req.user;
    const { course, lesson, file } = req.params;
    const storageParts = [username, course, lesson, file];
    try {
      if (isAppEngine()) {
        const url = gcsUrl(storageParts.join("/"), constants.BUCKET);
        res.redirect(301, url);
      } else {
        const imgFilePath = getTempDir(storageParts);
        if (fs.existsSync(imgFilePath)) {
          res.sendFile(imgFilePath);
        } else {
          res.status(404).send("ikke funnet");
        }
      }
    } catch (e) {
      res.status(404).send(e.message);
    }
  });
  app.post(paths.DISPLAY_FILE, async (req, res) => {
    const { username } = req.user;
    const { course, lesson, file } = req.params;
    const filename = [username, course, lesson, file].join("/");
    await saveToGcs(filename, Buffer.from(req.body), constants.BUCKET);
    res.send("ok");
  });
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
