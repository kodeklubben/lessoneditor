import {paths} from "@lessoneditor/api-interfaces";
import listFiles from "../lesson/list-files";

const lessonFiles = (app) => {
    app.get(paths.LESSON_FILES, async (req, res) => {
        const {lessonId} = req.params;
        const files = await listFiles(["drafts", lessonId]);
        res.send(files);
    });
};

export default lessonFiles
