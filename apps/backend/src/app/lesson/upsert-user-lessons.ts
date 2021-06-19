import saveFile from "../storage/save-file";
/**
 *
 * @param lessonDatas
 * @param username
 * @return {Promise<void>}
 */
const upsertUserLessons = async (lessonDatas, username) => {
    await saveFile(
        ["users", username, "lessons.json"],
        Buffer.from(JSON.stringify(lessonDatas))
    );
};

export default upsertUserLessons
