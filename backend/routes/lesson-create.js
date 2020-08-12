const paths = require("../paths");
const saveFile = require("../utils/save-file");
const nanoid = require("nanoid").customAlphabet(
  "01234567890abcdefghijklmnopqrstuvwxyz",
  7
);

module.exports = (app) => {
  app.post(paths.LESSON, async (req, res) => {
    const data = req.body;
    data.lessonId = nanoid();
    data.created = new Date().toISOString();
    data.updated = new Date().toISOString();
    data.createdBy = req.user.username;
    const buffer = Buffer.from(JSON.stringify(data));
    await saveFile(["drafts", data.lessonId, "data.json"], buffer);
    res.send(data);
  });
};
