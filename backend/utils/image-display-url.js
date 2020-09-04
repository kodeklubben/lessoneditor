module.exports = (lessonId, scratch = false) => {
  return scratch ? "/file/bilder/" : `/file/drafts/${lessonId}/`;
};
