const fs = require("fs");
const Multer = require("multer");
const crypto = require("crypto");
const getTempDir = require("../utils/get-temp-dir");

module.exports = Multer.diskStorage({
  destination: (req, res, cb) => {
    const lessonTmpDir = getTempDir(req.params.lessonId);
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
