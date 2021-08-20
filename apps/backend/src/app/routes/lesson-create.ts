import { paths } from "@lessoneditor/api-interfaces";
import createLessonData from "../lesson/create-lesson-data";
import thumbRefresh from "../thumb/thumb-refresh";
import baseUrl from "../utils/base-url";
import { Application } from "express";

const lessonCreate = (app: Application) => {
  app.post(paths.LESSON, async (req, res) => {
    // @ts-ignore
    const data = await createLessonData(req.body, req.user.username);
    const { lessonId, lesson } = data;
    console.debug("New lesson created", { lessonId, lesson });
    try {
      await thumbRefresh(baseUrl(req), lessonId, lesson);
    } catch (e) {
      console.error(e.message);
    }
    res.send(data);
  });
};

export default lessonCreate;
