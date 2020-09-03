const multer = require("../storage/multer");
const saveFile = require("../storage/save-file");
const paths = require("../paths");
const thumbRefresh = require("../thumb/thumb-refresh");
const baseUrl = require("../utils/base-url");
const loadDisplayFile = require("../storage/load-display-file");

module.exports = (app) => {
  app.get(paths.DISPLAY_FILE, async (req, res) => {
    const { lessonId, file } = req.params;
    const storageParts = ["drafts", lessonId, file];
    loadDisplayFile(storageParts, res);
  });
  /**
   * Her lagres markdown content blant annet.
   */
  app.post(paths.DISPLAY_FILE, async (req, res) => {
    const { lessonId, file } = req.params;
    await saveFile(["drafts", lessonId, file], Buffer.from(req.body));
    if (req.query.regenThumb) {
      await thumbRefresh(baseUrl(req), lessonId, file);
    }
    res.send("ok");
  });
  app.post(paths.LESSON_UPLOADS, multer.single("file"), async (req, res) => {
    if (!req.file) {
      res.status(400).send("No file uploaded.");
      return;
    }
    const { lessonId } = req.params;
    const fileInfo = req.file;
    fileInfo.imageUrl = await saveFile(
      ["drafts", lessonId, req.file.originalname],
      req.file.buffer
    );
    delete fileInfo.buffer;
    res.send(fileInfo);
  });
  app.delete(paths.LESSON_UPLOADS, (req, res, next) => {});
};
