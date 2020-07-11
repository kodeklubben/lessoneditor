module.exports = (lessonData) => {
  let metaData = "---";
  metaData += `\n${lessonData.title}`;
  metaData += `\n${lessonData.author}`;
  metaData += `\n${lessonData.language}`;
  if (lessonData.translator) {
    metaData += `\n${lessonData.language}`;
  }
  return metaData;
};
