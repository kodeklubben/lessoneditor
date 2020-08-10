const language = ["nb", "nn", "en", "is"];

module.exports = (lessonId) => {
  let metaData = {};
  metaData.lessonId = lessonId;
  metaData.course = "course";
  metaData.title = "title";
  metaData.language = language[Math.floor(Math.random() * language.length)];
  return metaData;
};
