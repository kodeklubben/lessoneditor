import {paths} from "@lessoneditor/api-interfaces";
import afterStar from "../utils/after-star";
import isAppEngine from "../utils/isAppEngine";
import gcsUrl from "../utils/gcs-url";
import getTempDir from "../utils/get-temp-dir";

const fs = require("fs");

const serveFile = (app) => {
    app.get(paths.FILE, function (req, res) {
        const resource = afterStar(paths.FILE, req.path).split("/");
        if (isAppEngine()) {
            res.redirect(gcsUrl(resource.join("/")));
        } else {
            const filePath = getTempDir(resource);
            if (fs.existsSync(filePath)) {
                res.sendFile(filePath);
            } else {
                res.status(404).send("ikke funnet");
            }
        }
    });
}

export default serveFile
