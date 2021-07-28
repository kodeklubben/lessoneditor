import loadFile from "../storage/load-file";
import listFiles from "./list-files";
import yaml from "js-yaml"

const getLessonData = async (lessonId) => {
    const fileList = await listFiles(["drafts", lessonId]);
    const lessonData = {
        meta: {
            lessonId,
            course: null,
            title: null,
        },
        files: []
    };
    const lessonFiles = [];
    for (let i in fileList) {
        if (fileList[i].filename === "preview.png") {
            continue;
        }
        if (fileList[i].filename === "data.json") {
            const metadata = JSON.parse(
                await loadFile(["drafts", lessonId, fileList[i].filename])
            );
            lessonData.meta.course = metadata.course;
            lessonData.meta.title = metadata.lesson;
            continue;
        }
        const fileExt = fileList[i].filename.split(".").pop()
        const data = {
            ext: fileExt,
            filename: fileList[i].filename,
            content: await loadFile(["drafts", lessonId, fileList[i].filename])
        };
        if (data.filename === "lesson.yml") {
            data.content = yaml.dump(JSON.parse(data.content), {flowLevel: 2});
        }
        lessonFiles.push(data);
    }
    lessonData.files = lessonFiles;
    return lessonData;
};

export default getLessonData
