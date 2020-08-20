module.exports = function (app) {
  require("../../backend/routes/auth.local")(app);
  require("../../backend/routes/configure")(app);
  require("../../backend/routes/current-user")(app);
  require("../../backend/routes/current-user-lessons")(app);
  require("../../backend/routes/lesson-create")(app);
  require("../../backend/routes/lesson-data")(app);
  require("../../backend/routes/lesson-files")(app);
  require("../../backend/routes/lesson-proxy")(app);
  require("../../backend/routes/lesson-uploads")(app);
  require("../../backend/routes/lesson-thumb")(app);
  require("../../backend/routes/serve-file")(app);
};
