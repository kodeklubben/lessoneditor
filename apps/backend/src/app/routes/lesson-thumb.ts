import {paths} from "@lessoneditor/api-interfaces";
import thumbRefresh from "../thumb/thumb-refresh";
import baseUrl from "../utils/base-url";
import {Application} from "express";


const lessonThumb = (app: Application) => {
    app.get(paths.LESSON_THUMB, async (req, res) => {
        const {lessonId, file} = req.params;
        try {
            const thumbUrl = await thumbRefresh(baseUrl(req), lessonId, file);
            res.status(201).send(thumbUrl);
        } catch (e) {
            res.status(501).send(e.message);
        }
    });
};

export default lessonThumb
