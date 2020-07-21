const app = require("express")();
const isAppEngine = require("./utils/isAppEngine");

module.exports = async () => {
  require("./routes/auth")(app);
  require("./routes/configure")(app);
  require("./routes/current-user")(app);
  require("./routes/lesson-data")(app);
  require("./routes/lesson-files")(app);
  require("./routes/lesson-proxy")(app);
  require("./routes/lesson-uploads")(app);
  require("./routes/lesson-thumb")(app);
  require("./routes/lesson-submit")(app);
  if (isAppEngine()) {
    require("./routes/lesson-uploads")(app);
  } else {
    require("./routes/lesson-uploads.local")(app);
  }
  require("./routes/serve-frontend")(app);
  return app;
};
