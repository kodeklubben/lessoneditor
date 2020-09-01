const loadFile = require("../storage/load-file");

module.exports = async (username, course, title) => {
  const result = await loadFile(["users", username, "lessons.json"]);
  let lessonId = null;
  if (result) {
    const lessons = JSON.parse(result);
    lessons.forEach((lesson) => {
      if (course === lesson.course && title === lesson.lesson) {
        lessonId = lesson.lessonId;
      }
    });
  }
  return lessonId;
};
