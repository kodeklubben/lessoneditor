import {paths} from "@lessoneditor/api-interfaces";
import githubLessonUrl from "../utils/github-lesson-url";
import axios from "axios";
import afterStar from "../utils/after-star";
import resolveMarkdownUrls from "../utils/resolve-markdown-urls";


const lessonProxy = (app) => {
    app.get(paths.LESSON_PROXY, async (req, res) => {
        const resource = afterStar(paths.LESSON_PROXY, req.path);
        const url = githubLessonUrl([resource + ".md"]);
        const remoteFolder = url.substr(0, url.lastIndexOf("/"));
        try {
            const content = await axios.get(url);
            const resolved = resolveMarkdownUrls(content.data, remoteFolder);
            res.set("content-type", "text/plain");
            res.send(resolved);
        } catch (e) {
            res.status(404).send(e.message);
        }
    });
}
export default lessonProxy
