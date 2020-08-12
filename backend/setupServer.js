module.exports = function (app) {
  require("./routes/auth")(app);
  require("./routes/configure")(app);
  require("./routes/current-user")(app);
  require("./routes/current-user-lessons")(app);
  require("./routes/lesson-create")(app);
  require("./routes/lesson-data")(app);
  require("./routes/lesson-files")(app);
  require("./routes/lesson-proxy")(app);
  require("./routes/lesson-submit")(app);
  require("./routes/lesson-thumb")(app);
  require("./routes/lesson-uploads")(app);
  require("./routes/serve-file")(app);
  require("./routes/serve-frontend")(app);
};
