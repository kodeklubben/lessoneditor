const multer = require("../storage/multer");
const saveFile = require("../storage/save-file");
const paths = require("../paths");
const fs = require("fs");
const getTempDir = require("../utils/get-temp-dir");
const isAppEngine = require("../utils/isAppEngine");
const loadFromGcs = require("../storage/load-from-gcs");
const thumbRefresh = require("../thumb/thumb-refresh");
const baseUrl = require("../utils/base-url");

module.exports = (app) => {
  app.get(paths.DISPLAY_FILE, async (req, res) => {
    const { lessonId, file } = req.params;
    const storageParts = ["drafts", lessonId, file];
    try {
      if (isAppEngine()) {
        loadFromGcs(storageParts.join("/")).pipe(res);
      } else {
        // await new Promise((resolve) => setTimeout(resolve, 1690));
        const localFilePath = getTempDir(storageParts);
        if (fs.existsSync(localFilePath)) {
          fs.createReadStream(localFilePath).pipe(res);
        } else {
          res.status(404).send("ikke funnet");
        }
      }
    } catch (e) {
      res.status(404).send(e.message);
    }
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
