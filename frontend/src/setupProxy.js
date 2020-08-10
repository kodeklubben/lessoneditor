module.exports = function (app) {
  require("../../backend/routes/auth.local")(app);
  require("../../backend/routes/configure")(app);
  require("../../backend/routes/current-user.local")(app);
  require("../../backend/routes/lesson-create")(app);
  require("../../backend/routes/lesson-data")(app);
  require("../../backend/routes/lesson-proxy")(app);
  require("../../backend/routes/lesson-uploads")(app);
  require("../../backend/routes/serve-file")(app);
};
