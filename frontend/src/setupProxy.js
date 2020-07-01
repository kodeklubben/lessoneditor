module.exports = function (app) {
  require("../../backend/routes/current-user.local")(app);
  require("../../backend/routes/lessons.local")(app);
  require("../../backend/routes/oppgaver.local")(app);
  require("../../backend/routes/uploads.local")(app);
};
