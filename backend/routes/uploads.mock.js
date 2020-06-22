const fs = require("fs");
const path = require("path");
const distStorage = require("../storage/disk-storage");
const multer = require("../storage/multer")(distStorage);
const getTempDir = require("../utils/get-temp-dir");
const getImgLoc = (lessonId, filename) => {
  return getTempDir(lessonId) + path.sep + filename;
};
module.exports = (app) => {
  const apiUploadGetPath = "/api/uploads/:lessonId/:filename";
  app.get(apiUploadGetPath, (req, res) => {
    const { lessonId, filename } = req.params;
    return res.sendFile(getImgLoc(lessonId, filename));
  });
  app.post("/api/uploads/:lessonId", multer.single("file"), (req, res) => {
    if (!req.file) {
      res.status(400).send("No file uploaded.");
      return;
    }
    const lessonId = req.params.lessonId;
    const fileInfo = req.file;
    const mapObj = { ":lessonId": lessonId, ":filename": fileInfo.filename };
    const re = new RegExp(Object.keys(mapObj).join("|"), "gi");
    fileInfo.imageUrl = apiUploadGetPath.replace(re, function (matched) {
      return mapObj[matched];
    });
    res.send(fileInfo);
  });
  app.delete("/api/uploads/:lessonId", (req, res, next) => {
    const filename = req.body.filename;
    if (fs.lstatSync(`static/images/${filename}`).isFile()) {
      fs.unlink(`static/images/${filename}`, (err) => {
        if (err) throw err;
        console.log(`static/images/${filename} was deleted.`);
      });
    }
    // Todo: Code for deleting a picture
  });
};
