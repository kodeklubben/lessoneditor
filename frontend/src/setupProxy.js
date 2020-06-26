const oppgaverLocal = require("../../backend/routes/oppgaver.local");
const uploadsLocal = require("../../backend/routes/uploads.local");
const lessonsLocal = require("../../backend/routes/lessons.local");
module.exports = function (app) {
  oppgaverLocal(app);
  uploadsLocal(app);
  lessonsLocal(app);
};
