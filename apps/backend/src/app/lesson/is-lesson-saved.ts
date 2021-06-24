import loadUserLessons from "./load-user-lessons";

const isLessonSaved = async (username, course, title) => {
  const lessons = await loadUserLessons([username]);
  let lessonId = undefined;
  lessons.forEach((lesson) => {
    if (course === lesson.course && title === lesson.lesson) {
      lessonId = lesson.lessonId;
    }
  });
  return lessonId;
};

export default isLessonSaved;
