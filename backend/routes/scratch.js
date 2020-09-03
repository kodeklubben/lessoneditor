const paths = require("../paths");
const loadDisplayFile = require("../storage/load-display-file");
const listFiles = require("../lesson/list-files");

module.exports = async (app) => {
  app.get(paths.DISPLAY_DEFAULT_FILE, (req, res) => {
    const { file } = req.params;
    const storageParts = ["bilder", file];
    loadDisplayFile(storageParts, res);
  });
  app.get(paths.DEFAULT_FILES, async (req, res) => {
    const files = await listFiles(["bilder"]);
    res.send(files);
  });
};
