import lessonInit from "../utils/lesson-init";
import loadFile from "../storage/load-file";
import saveFile from "../storage/save-file";

const createLessonData = async (lessonData, username) => {
    const data = lessonInit(lessonData, username);
    const {lessonId, lesson} = data;
    const defaultMdPathParts = ["drafts", lessonId, lesson + ".md"];
    const existing = await loadFile(defaultMdPathParts);
    const promises = [];
    if (!existing) {
        // Creating a dummy file
        promises.push(saveFile(defaultMdPathParts, Buffer.from(" ")));
    }
    promises.push(
        saveFile(
            ["drafts", lessonId, "data.json"],
            Buffer.from(JSON.stringify(data))
        )
    );
    promises.push(
        saveFile(
            ["drafts", lessonId, "lesson.yml"],
            Buffer.from(JSON.stringify({}))
        )
    );
    await Promise.all(promises);
    return data;
};

export default createLessonData
