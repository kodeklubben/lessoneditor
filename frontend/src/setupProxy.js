const oppgaver = require("../../backend/mocks/oppgaver");
const uploads = require("../../backend/mocks/uploads");

module.exports = function (app) {
  oppgaver(app);
  uploads(app);
};
