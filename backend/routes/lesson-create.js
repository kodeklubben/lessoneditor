const paths = require("../paths");
const saveFile = require("../utils/save-file");
const thumbRefresh = require("../utils/thumb-refresh");
const baseUrl = require("../utils/base-url");
const nanoid = require("nanoid").customAlphabet(
  "01234567890abcdefghijklmnopqrstuvwxyz",
  7
);

module.exports = (app) => {
  app.post(paths.LESSON, async (req, res) => {
    const data = Object.assign({}, req.body);
    data.lessonId = nanoid();
    data.created = new Date().toISOString();
    data.updated = new Date().toISOString();
    data.createdBy = req.user.username;
    const buffer = Buffer.from(JSON.stringify(data));
    await saveFile(
      ["drafts", data.lessonId, data.lesson + ".md"],
      Buffer.from("# " + data.title)
    );
    await saveFile(["drafts", data.lessonId, "data.json"], buffer);
    await thumbRefresh(baseUrl(req), data.lessonId, data.lesson);
    res.send(data);
  });
};
