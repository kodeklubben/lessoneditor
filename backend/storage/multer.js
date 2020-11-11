const multer = require("multer");
const fileFilter = (req, file, cb) => {
  file.mimetype === "image/jpeg" ||
  file.mimetype === "image/png" ||
  file.mimetype === "image/gif"
    ? cb(null, true)
    : cb(null, false);
};
module.exports = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter,
});
