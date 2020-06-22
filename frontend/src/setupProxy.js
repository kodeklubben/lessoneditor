const oppgaverMock = require("../../backend/routes/oppgaver.mock");
const uploadsMock = require("../../backend/routes/uploads.mock");

module.exports = function (app) {
  oppgaverMock(app);
  uploadsMock(app);
};
