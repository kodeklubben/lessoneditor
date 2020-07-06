const axios = require("axios");
const constants = require("../constants.json");
const paths = require("../paths");
const { format } = require("util");

module.exports = (app) => {
  app.post(paths.LESSON_DATA, async (req, res) => {
    const { username } = req.user;
    const { course, lesson } = req.params;
    const filename = [username, course, lesson, "data.json"].join("/");
    await saveToGcs(filename, JSON.stringify(req.body), constants.BUCKET);
    res.send("ok");
  });
  app.get(paths.LESSON_DATA, async (req, res) => {
    const { username } = req.user;
    const { course, lesson } = req.params;
    const filename = [username, course, lesson, "data.json"].join("/");
    const url = format(
      `${constants.GOOGLE_STORAGE_PREFIX}/${constants.BUCKET}/${filename}`
    );
    const content = await axios.get(url);
    res.send(content);
  });
};
