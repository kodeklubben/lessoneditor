const paths = require("../paths");
const fs = require("fs");
const getTempDir = require("../utils/get-temp-dir");
const saveToDisk = require("../utils/save-to-disk");
const faker = require("faker");
const name = faker.name.findName();
const email = faker.internet.email();
const lessonsFilename = getTempDir(["user-lessons.json"]);
module.exports = (app) => {
  app.get(paths.USER, async (req, res) => {
    res.send({
      authenticated: true,
      email,
      name,
      username: "test-username",
      photo: "https://via.placeholder.com/150",
    });
  });
  app.post(paths.USER_LESSONS, async (req, res) => {
    const buffer = Buffer.from(JSON.stringify(req.body));
    await saveToDisk(lessonsFilename, buffer);
    res.send("ok");
  });
  app.get(paths.USER_LESSONS, async (req, res) => {
    if (fs.existsSync(lessonsFilename)) {
      res.send(fs.readFileSync(lessonsFilename));
    } else {
      res.send([]);
    }
  });
};
