const loadFile = require("../utils/load-file");
const getMetaData = require("../utils/get-meta-data.mock");

module.exports = async (username, course, lesson) => {
  let lessonData = getMetaData(username, course, lesson);
  const md = await loadFile([course, lesson, `${lesson}.md`]);
  if (md) {
    lessonData.markdown = md;
  } else {
    return null;
  }
  return lessonData;
};
