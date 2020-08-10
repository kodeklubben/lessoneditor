const paths = require("../paths");
const baseUrl = require("../utils/base-url");
const thumbFetch = require("../utils/thumb-fetch");
const isAppEngine = require("../utils/isAppEngine");
module.exports = (app) => {
  app.get(paths.LESSON_THUMB, async (req, res) => {
    const { lessonId, file } = req.params;
    try {
      const serverBaseUrl = baseUrl(req);
      const previewurl = [serverBaseUrl, "preview", lessonId, file].join("/");
      const storagePath = ["drafts", lessonId, "preview.png"];
      let thumbUrl = await thumbFetch(previewurl, storagePath);
      if (!isAppEngine()) {
        thumbUrl = serverBaseUrl + thumbUrl;
      }
      res.status(201).send(thumbUrl);
    } catch (e) {
      res.status(501).send(e.message);
    }
  });
};
