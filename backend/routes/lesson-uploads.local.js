const path = require("path");
const multer = require("../storage/multer");
const getTempDir = require("../utils/get-temp-dir");
const saveToDisk = require("../utils/save-to-disk");
const resolveUrlTemplate = require("../utils/resolve-url-template");
const paths = require("../paths");
const getImgLoc = (course, lesson, file) => {
  return [getTempDir([course, lesson]), file].join(path.sep);
};
module.exports = (app) => {
  app.get(paths.DISPLAY_FILE, (req, res) => {
    const { course, lesson, file } = req.params;
    return res.sendFile(getImgLoc(course, lesson, file));
  });
  app.post(paths.DISPLAY_FILE, async (req, res) => {
    const { course, lesson, file } = req.params;
    const filename = getImgLoc(course, lesson, file);
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
    await saveToDisk(getImgLoc(course, lesson, file), req.file.buffer);
    res.send(fileInfo);
  });

  app.delete(paths.LESSON_UPLOADS, (req, res, next) => {
    // Todo: Code for deleting a picture
  });
};
