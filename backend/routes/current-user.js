const axios = require("axios");
const paths = require("../paths");
const gcsUrl = require("../utils/gcs-url");
const saveToGcs = require("../utils/save-to-gcs");
const constants = require("../constants.json");
const getFilename = (username) => {
  return [username, "user-lessons.json"].join("/");
};
module.exports = (app) => {
  app.get(paths.USER, async (req, res) => {
    res.send({
      authenticated: req.isAuthenticated(),
      email: req.user.email,
      name: req.user.name,
      username: req.user.username,
      photo: req.user.photo,
    });
  });
  app.post(paths.USER_LESSONS, async (req, res) => {
    const filename = getFilename(req.user.username);
    const buffer = Buffer.from(JSON.stringify(req.body));
    await saveToGcs(filename, buffer, constants.BUCKET);
    res.send("ok");
  });
  app.get(paths.USER_LESSONS, async (req, res) => {
    const filename = getFilename(req.user.username);
    const url = gcsUrl(filename, constants.BUCKET);
    try {
      const result = await axios.get(url);
      res.send(result.data);
    } catch (e) {
      if (e.response.status === 404) {
        res.send([]);
      } else {
        res.send(e.message);
      }
    }
  });
};
