const path = require("path");
const multer = require("../storage/multer");
const getTempDir = require("../utils/get-temp-dir");
const saveToDisk = require("../utils/save-to-disk");
const fs = require("fs");
const resolveUrlTemplate = require("../utils/resolve-url-template");
const paths = require("../paths");
module.exports = (app) => {
  app.get(paths.DISPLAY_FILE, (req, res) => {
    const { course, lesson, file } = req.params;
    const imgLoc = getTempDir([course, lesson, file]);
    if (fs.existsSync(imgLoc)) {
      res.contentType(imgLoc);
      res.sendFile(imgLoc);
    } else {
      res.status(404).send("");
    }
    res.end();
  });
  app.post(paths.DISPLAY_FILE, async (req, res) => {
    const { course, lesson, file } = req.params;
    const filename = getTempDir([course, lesson, file]);
    await saveToDisk(filename, Buffer.from(req.body));
    return res.send("ok");
  });
  app.post(paths.LESSON_UPLOADS, multer.single("file"), async (req, res) => {
    if (!req.file) {
      res.status(400).send("No file uploaded.");
      return;
    }
    const { course, lesson } = req.params;
    const fileInfo = req.file;
    const file = fileInfo.originalname;
    fileInfo.imageUrl = resolveUrlTemplate(paths.DISPLAY_FILE, {
      course,
      lesson,
      file,
    });
    await saveToDisk(getTempDir([course, lesson, file]), req.file.buffer);
    res.send(fileInfo);
  });

  app.delete(paths.LESSON_UPLOADS, (req, res, next) => {
    // Todo: Code for deleting a picture
  });
};
