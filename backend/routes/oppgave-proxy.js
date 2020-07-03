const axios = require("axios");

module.exports = (app) => {
  app.get("/api/lessons-proxy/*", async (req, res) => {
    const githubPrefix =
      "https://raw.githubusercontent.com/kodeklubben/oppgaver/master/src";
    const len = "/api/lessons-proxy/*".length;
    const resource = req.path.substring(len - 2);
    const url = githubPrefix + resource + ".md";
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
