const saveFile = require("../storage/save-file");
/**
 *
 * @param lessonDatas
 * @param username
 * @return {Promise<void>}
 */
module.exports = async (lessonDatas, username) => {
  await saveFile(
    ["users", username, "lessons.json"],
    Buffer.from(JSON.stringify(lessonDatas))
  );
};
