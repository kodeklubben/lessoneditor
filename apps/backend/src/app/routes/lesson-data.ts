import {paths} from "@lessoneditor/api-interfaces";
import saveFile from "../storage/save-file";
import loadFile from "../storage/load-file";
import {Application} from "express";


const lessonData = (app: Application) => {
    app.post(paths.LESSON_DATA, async (req, res) => {
        const {lessonId, filename} = req.params;
        const buffer = Buffer.from(JSON.stringify(req.body));
        await saveFile(["drafts", lessonId, filename], buffer);
        res.send("ok");
    });
    app.get(paths.LESSON_DATA, async (req, res) => {
        const {lessonId, filename} = req.params;
        const content = await loadFile(["drafts", lessonId, filename]);
        res.send(JSON.parse(content));
    });
};

export default lessonData
