
import {paths} from "@lessoneditor/api-interfaces";
import isAppEngine from "../utils/isAppEngine";
import saveToGcs from "./save-to-gcs";
import getTempDir from "../utils/get-temp-dir";
import saveToDisk from "./save-to-disk";
const saveFile = async (pathParts, buffer) => {
    const publicFilePath = pathParts.join("/");
    if (isAppEngine()) {
        return await saveToGcs(publicFilePath, buffer);
    } else {
        const filename = getTempDir(pathParts);
        await saveToDisk(filename, buffer);
        return paths.FILE.replace("*", publicFilePath);
    }
};


export default saveFile
