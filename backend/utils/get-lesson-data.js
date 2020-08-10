const loadFile = require("../utils/load-file");
const getMetaData = require("../utils/get-meta-data.mock");

module.exports = async (lessonId) => {
  let lessonData = getMetaData(lessonId);
  const md = await loadFile(["drafts", lessonId, `${lessonData.lesson}.md`]);
  if (md) {
    lessonData.markdown = md;
  } else {
    return null;
  }
  return lessonData;
};
