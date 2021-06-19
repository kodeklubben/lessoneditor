import loadFileGcsToString from "./load-file-gcs-to-string";
import getTempDir from "../utils/get-temp-dir";
import isAppEngine from "../utils/isAppEngine";


const fs = require("fs");

const loadFile = async (pathParts) => {
    if (isAppEngine()) {
        try {
            const filename = pathParts.join("/");
            return await loadFileGcsToString(filename);
        } catch (e) {
            console.error(e.message);
            return null;
        }
    } else {
        const filename = getTempDir(pathParts);
        if (fs.existsSync(filename)) {
            return fs.readFileSync(filename, "utf8");
        } else {
            return null;
        }
    }
}

export default loadFile
