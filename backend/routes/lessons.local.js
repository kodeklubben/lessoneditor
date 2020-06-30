const bodyParser = require("body-parser");
const getTempDir = require("../utils/get-temp-dir");
const fs = require("fs");

const getFileName = function (lessonId) {
  const lessonTmpDir = getTempDir(lessonId);
  if (!fs.existsSync(lessonTmpDir)) {
    fs.mkdirSync(lessonTmpDir);
  }
  return lessonTmpDir + "/data.json";
};

module.exports = (app) => {
  app.use(bodyParser.json());
  app.post("/api/lessons/:lessonId", async (req, res) => {
    const filename = getFileName(req.params.lessonId);
    fs.writeFileSync(filename, JSON.stringify(req.body));
    res.send("ok");
  });
  app.get("/api/lessons/:lessonId", async (req, res) => {
    const filename = getFileName(req.params.lessonId);
    const content = fs.readFileSync(filename, "utf8");
    res.send(JSON.parse(content));
  });
};
