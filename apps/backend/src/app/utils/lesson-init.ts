const { customAlphabet } = require("nanoid");
import { Lesson } from "@lessoneditor/api-interfaces";

const lessonInit = (lessonData: Lesson, username: string): Lesson => {
  const nanoid = customAlphabet("01234567890abcdefghijklmnopqrstuvwxyz", 7);
  const data: Lesson = Object.assign({}, lessonData);
  data.lessonId = nanoid();
  data.created = new Date().toISOString();
  data.updated = new Date().toISOString();
  data.createdBy = username;
  return data;
};

export default lessonInit;
