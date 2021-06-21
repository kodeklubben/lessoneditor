import multerInstance from "../storage/multer";
import {paths} from "@lessoneditor/api-interfaces";
import baseUrl from "../utils/base-url";
import loadFromGcs from "../storage/load-from-gcs";
import saveFile from "../storage/save-file";
import isAppEngine from "../utils/isAppEngine";
import thumbRefresh from "../thumb/thumb-refresh";
import getTempDir from "../utils/get-temp-dir";
import {Application} from "express";
import * as mime from "mime/lite";

const fs = require("fs");


const lessonUploads = (app: Application) => {
    app.get(paths.DISPLAY_FILE, async (req, res) => {
        const {lessonId, file} = req.params;
        const storageParts = ["drafts", lessonId, file];
        res.set('Content-Type', mime.getType(file));
        try {

            if (isAppEngine()) {
                loadFromGcs(storageParts.join("/")).pipe(res);
            } else {
                const localFilePath = getTempDir(storageParts);
                if (fs.existsSync(localFilePath)) {
                    fs.createReadStream(localFilePath).pipe(res);
                } else {
                    res.status(404).send("ikke funnet");
                }
            }
        } catch (e) {
            res.status(404).send(e.message);
        }
    });
    /**
     * Her lagres markdown content blant annet.
     */
    app.post(paths.DISPLAY_FILE, async (req, res) => {
        const {lessonId, file} = req.params;
        await saveFile(["drafts", lessonId, file], Buffer.from(req.body));
        if (req.query.regenThumb) {
            await thumbRefresh(baseUrl(req), lessonId, file);
        }
        res.send("ok");
    });
    app.post(paths.LESSON_UPLOADS, multerInstance.single("file"), async (req, res) => {
        // @ts-ignore
        if (!req.file) {
            res.status(400).send("No file uploaded.");
            return;
        }
        const {lessonId} = req.params;
        // @ts-ignore
        const fileInfo = req.file;
        fileInfo.imageUrl = await saveFile(
            // @ts-ignore
            ["drafts", lessonId, req.file.originalname],
            // @ts-ignore
            req.file.buffer
        );
        delete fileInfo.buffer;
        res.send(fileInfo);
    });
    app.delete(paths.LESSON_UPLOADS, (req, res, next) => {
    });
}
export default lessonUploads
