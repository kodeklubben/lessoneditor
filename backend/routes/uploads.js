const Multer = require("multer");
const multer = require("../storage/multer")(Multer.memoryStorage());
const saveToGcs = require("../utils/save-to-gcs");
module.exports = (app) => {
  app.post(
    "/api/uploads/:lessonId",
    multer.single("file"),
    async (req, res, next) => {
      if (!req.file) {
        res.status(400).send("No file uploaded.");
        return;
      }
      const lessonId = req.params.lessonId;
      const filename = [lessonId, req.file.originalname].join("/");
      const fileInfo = req.file;
      fileInfo.imageUrl = await saveToGcs(
        filename,
        req.file.buffer,
        "lessoneditor"
      );
      res.send(fileInfo);
    }
  );
  app.delete("/api/uploads/:lessonId", (req, res, next) => {});
};
