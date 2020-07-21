const axios = require("axios");
const resolveMarkdown = require("../utils/resolve-markdown-urls");
const paths = require("../paths");
const constants = require("../constants.json");
module.exports = (app) => {
  app.get(paths.LESSON_PROXY, async (req, res) => {
    const len = paths.LESSON_PROXY.length;
    const resource = req.path.substring(len - 2);
    // Todo: fix env in constants.GITHUB_LESSON_PREFIX
    const url = constants.GITHUB_LESSON_PREFIX + resource + ".md";
    const remoteFolder = url.substr(0, url.lastIndexOf("/"));
    try {
      const content = await axios.get(url);
      const markdownContent = content.data;
      const resolved = resolveMarkdown(markdownContent, remoteFolder);
      res.set("content-type", "text/plain");
      res.send(resolved);
    } catch (e) {
      res.status(404).send(e.message);
    }
  });
};
// http://localhost:3232/api/lessons-proxy/web/hei_js/hei_js.md
