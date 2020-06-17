const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const multer = require("multer");
const sessionTmpDir = os.tmpdir();

const getUploadTmpDirPath = (lessonId) => {
  return sessionTmpDir + path.sep + lessonId;
};
const getFileLocation = (lessonId, filename) => {
  return getUploadTmpDirPath(lessonId) + path.sep + filename;
};
const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    const lessonTmpDir = getUploadTmpDirPath(req.params.lessonId);
    if (!fs.existsSync(lessonTmpDir)) {
      fs.mkdirSync(lessonTmpDir);
    }
    cb(null, lessonTmpDir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") +
        crypto.randomBytes(16).toString("hex") +
        "." +
        file.mimetype.split("/")[1]
    );
  },
});

const fileFilter = (req, file, cb) => {
  file.mimetype === "image/jpeg" || file.mimetype === "image/png"
    ? cb(null, true)
    : cb(null, false);
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

module.exports = (app) => {
  const apiUploadGetPath = "/api/uploads/:lessonId/:filename";
  app.get(apiUploadGetPath, (req, res, next) => {
    return res.sendFile(
      getFileLocation(req.params.lessonId, req.params.filename)
    );
  });
  app.post(
    "/api/uploads/:lessonId",
    upload.single("file"),
    (req, res, next) => {
      const lessonId = req.params.lessonId;
      const fileInfo = req.file;
      const mapObj = { ":lessonId": lessonId, ":filename": fileInfo.filename };
      const re = new RegExp(Object.keys(mapObj).join("|"), "gi");
      fileInfo.imageUrl = apiUploadGetPath.replace(re, function (matched) {
        return mapObj[matched];
      });
      res.send(fileInfo);
    }
  );
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
