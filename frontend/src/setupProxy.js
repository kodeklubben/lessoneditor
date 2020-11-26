const path = require("path");
module.exports = function (app) {
  [
    "auth.local",
    "configure",
    "current-user",
    "current-user-lessons",
    "lesson-create",
    "lesson-data",
    "lesson-files",
    "lesson-proxy",
    "lesson-submit",
    "lesson-thumb",
    "lesson-uploads",
    "serve-file",
  ].forEach((route) => {
    require(path.join(__dirname, "../../backend/src/routes/", route))(app);
  });
};
