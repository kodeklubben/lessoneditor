import {sep} from "path";
import {tmpdir} from "os";

const sessionTmpDir = tmpdir();

const getTempDir = (folders) => {
    const foldersClone = [...folders];
    foldersClone.unshift("lessoneditor");
    foldersClone.unshift(sessionTmpDir);
    return foldersClone.join(sep);
};

export default getTempDir
