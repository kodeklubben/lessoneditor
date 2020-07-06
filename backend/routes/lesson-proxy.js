const axios = require("axios");
const paths = require("../paths");
const constants = require("../constants.json");
module.exports = (app) => {
  app.get(paths.LESSON_PROXY, async (req, res) => {
    const len = paths.LESSON_PROXY.length;
    const resource = req.path.substring(len - 2);
    const url = constants.GITHUB_LESSON_PREFIX + resource + ".md";
    const remoteFolder = url.substr(0, url.lastIndexOf("/"));
    try {
      const content = await axios.get(url);
      const markdownContent = content.data;
      res.set("content-type", "text/plain");
      const fixed = markdownContent.replace(/(!\[.*?\]\()(.+?)(\))/g, function (
        whole,
        a,
        b,
        c
      ) {
        const newUrl = remoteFolder + "/" + b;
        return a + newUrl + c;
      });
      res.send(fixed);
    } catch (e) {
      res.status(404).send(e.message);
    }
  });
};
// http://localhost:3232/api/lessons-proxy/web/hei_js/hei_js.md
