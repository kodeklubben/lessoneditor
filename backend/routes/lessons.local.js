const bodyParser = require("body-parser");
const getTempDir = require("../utils/get-temp-dir");
const fs = require("fs");
module.exports = (app) => {
  app.use(bodyParser.json());
  app.post("/api/lessons/:lessonId", async (req, res) => {
    const lessonTmpDir = getTempDir(req.params.lessonId);
    if (!fs.existsSync(lessonTmpDir)) {
      fs.mkdirSync(lessonTmpDir);
    }
    const filename = lessonTmpDir + "/data.json";
    fs.writeFileSync(filename, JSON.stringify(req.body));
    res.send("ok");
  });
};
