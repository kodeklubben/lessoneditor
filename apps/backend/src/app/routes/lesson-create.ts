import {paths} from "@lessoneditor/api-interfaces";
import createLessonData from "../lesson/create-lesson-data";
import thumbRefresh from "../thumb/thumb-refresh";
import baseUrl from "../utils/base-url";



const lessonCreate = (app) => {
    app.post(paths.LESSON, async (req, res) => {
        const data = await createLessonData(req.body, req.user.username);
        const {lessonId, lesson} = data;
        console.debug("New lesson created", {lessonId, lesson});
        try {
            await thumbRefresh(baseUrl(req), lessonId, lesson);
        } catch (e) {
            console.error(e.message);
        }
        res.send(data);
    });
}

export default lessonCreate
