const loadUserLessons = require("../lesson/load-user-lessons");

module.exports = async (username, course, title) => {
  const result = await loadUserLessons([username]);
  let lessonId = undefined;
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
