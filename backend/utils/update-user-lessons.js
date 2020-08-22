const loadFile = require("./load-file");
const saveFile = require("./save-file");

module.exports = async (lessonId, course, lesson, username) => {
  const newLesson = {
    lessonId: lessonId,
    course: course,
    lesson: lesson,
  };
  let lessons = JSON.parse(await loadFile(["users", username, "lessons.json"]));
  lessons.push(newLesson);
  const buffer = Buffer.from(JSON.stringify(lessons));
  await saveFile(["users", username, "lessons.json"], buffer);
};
