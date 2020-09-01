const nanoid = require("nanoid").customAlphabet(
  "01234567890abcdefghijklmnopqrstuvwxyz",
  7
);

module.exports = (lessonData, username) => {
  const data = Object.assign({}, lessonData);
  data.lessonId = nanoid();
  data.created = new Date().toISOString();
  data.updated = new Date().toISOString();
  data.createdBy = username;
  return data;
};
