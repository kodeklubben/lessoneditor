const loadToString = require("../src/storage/load-file-gcs-to-string");

loadToString("users/mijohansen/lessons.json", "lessoneditor").then((content) =>
  console.log(content)
);
