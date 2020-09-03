const isAppEngine = require("../utils/isAppEngine");
const loadFromGcs = require("../storage/load-from-gcs");
const getTempDir = require("../utils/get-temp-dir");
const fs = require("fs");

module.exports = (storageParts, res) => {
  try {
    if (isAppEngine()) {
      loadFromGcs(storageParts.join("/")).pipe(res);
    } else {
      const localFilePath = getTempDir(storageParts);
      if (fs.existsSync(localFilePath)) {
        fs.createReadStream(localFilePath).pipe(res);
      } else {
        res.status(404).send("ikke funnet");
      }
    }
  } catch (e) {
    res.status(404).send(e.message);
  }
};
