const axios = require("axios");
const resolveMarkdown = require("../utils/resolve-markdown-urls");
const paths = require("../paths");
const githubLessonUrl = require("../utils/github-lesson-url");
const afterStar = require("../utils/after-star");
module.exports = (app) => {
  app.get(paths.LESSON_PROXY, async (req, res) => {
    const resource = afterStar(paths.LESSON_PROXY, req.path);
    const url = githubLessonUrl([resource + ".md"]);
    const remoteFolder = url.substr(0, url.lastIndexOf("/"));
    try {
      const content = await axios.get(url);
      const resolved = resolveMarkdown(content.data, remoteFolder);
      res.set("content-type", "text/plain");
      res.send(resolved);
    } catch (e) {
      res.status(404).send(e.message);
    }
  });
};
