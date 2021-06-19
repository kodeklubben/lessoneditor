const fs = require("fs");
const path = require("path");
const saveToGcs = require("../src/storage/save-to-gcs");
const exampleBuffer = fs.readFileSync(
  path.resolve(__dirname, "..", "README.md")
);

saveToGcs("a-file-that/i-want-to-save.md", exampleBuffer, "lessoneditor").then(
  (filename) => {
    console.log(filename);
  }
);
