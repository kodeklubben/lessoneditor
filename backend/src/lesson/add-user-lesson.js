const loadUserLessons = require("./load-user-lessons");
const upsertUserLessons = require("./upsert-user-lessons");
/**
 * Legger til ett nytt draft til en bruker.
 * @param lessonData
 * @param username
 * @return {Promise<void>}
 */
module.exports = async (lessonData, username) => {
  const lessons = await loadUserLessons(username);
  lessons.push(lessonData);
  await upsertUserLessons(lessons, buffer);
};
