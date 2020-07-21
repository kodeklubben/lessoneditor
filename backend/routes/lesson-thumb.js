const paths = require("../paths");
const baseUrl = require("../utils/base-url");
const thumbFetch = require("../utils/thumb-fetch");
const isAppEngine = require("../utils/isAppEngine");
module.exports = (app) => {
  app.get(paths.LESSON_THUMB, async (req, res) => {
    const { username } = req.user;
    const { course, lesson, file } = req.params;
    try {
      const serverBaseUrl = baseUrl(req);
      const previewurl = [serverBaseUrl, "preview", course, lesson, file].join(
        "/"
      );
      const storagePath = [username, course, lesson, "preview.png"];
      let thumbUrl = await thumbFetch(username, previewurl, storagePath);
      if (!isAppEngine()) {
        thumbUrl = serverBaseUrl + thumbUrl;
      }
      res.status(201).send(thumbUrl);
    } catch (e) {
      res.status(501).send(e.message);
    }
  });
};
