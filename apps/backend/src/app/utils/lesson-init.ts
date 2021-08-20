const {customAlphabet} = require("nanoid");
import { Lesson } from "../lesson/lesson-models";

const lessonInit = (lessonData, username): Lesson => {
    const nanoid = customAlphabet("01234567890abcdefghijklmnopqrstuvwxyz", 7);
    const data: Lesson = Object.assign({}, lessonData);
    data.lessonId = nanoid();
    data.created = new Date().toISOString();
    data.updated = new Date().toISOString();
    data.createdBy = username;
    return data;
};

export default lessonInit
