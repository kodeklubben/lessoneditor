import loadUserLessons from "./load-user-lessons";
import upsertUserLessons from "./upsert-user-lessons";

/**
 * Legger til ett nytt draft til en bruker.
 * @param lessonData
 * @param username
 * @return {Promise<void>}
 */
const addUserLesson = async (lessonData, username) => {
    const lessons = await loadUserLessons(username);
    lessons.push(lessonData);
    await upsertUserLessons(lessons, username);
};

export default addUserLesson
