const loadToString = require("../backend/utils/load-file-gcs-to-string");

loadToString("users/mijohansen/lessons.json", "lessoneditor").then((content) =>
  console.log(content)
);
