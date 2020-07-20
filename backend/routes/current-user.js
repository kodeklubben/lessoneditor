const paths = require("../paths");
const saveFile = require("../utils/save-file");
const loadFile = require("../utils/load-file");

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
    const buffer = Buffer.from(JSON.stringify(req.body));
    const pathParts = [req.user.username, "user-lessons.json"];
    await saveFile(pathParts, buffer);
    res.send("ok");
  });
  app.get(paths.USER_LESSONS, async (req, res) => {
    const pathParts = [req.user.username, "user-lessons.json"];
    try {
      const result = await loadFile(pathParts);
      if (result) {
        res.send(result);
      } else {
        res.send([]);
      }
    } catch (e) {
      if (e.response.status === 404) {
        res.send([]);
      } else {
        res.send(e.message);
      }
    }
  });
};
