const { customAlphabet } = require("nanoid");

module.exports = (lessonData, username) => {
  const nanoid = customAlphabet("01234567890abcdefghijklmnopqrstuvwxyz", 7);
  const data = Object.assign({}, lessonData);
  data.lessonId = nanoid();
  data.created = new Date().toISOString();
  data.updated = new Date().toISOString();
  data.createdBy = username;
  return data;
};
