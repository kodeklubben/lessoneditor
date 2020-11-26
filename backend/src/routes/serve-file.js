const paths = require("../paths");
const isAppEngine = require("../utils/isAppEngine");
const gcsUrl = require("../utils/gcs-url");
const afterStar = require("../utils/after-star");
const getTempDir = require("../utils/get-temp-dir");
const fs = require("fs");

module.exports = (app) => {
  app.get(paths.FILE, function (req, res) {
    const resource = afterStar(paths.FILE, req.path).split("/");
    if (isAppEngine()) {
      res.redirect(gcsUrl(resource.join("/")));
    } else {
      const filePath = getTempDir(resource);
      if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
      } else {
        res.status(404).send("ikke funnet");
      }
    }
  });
};
