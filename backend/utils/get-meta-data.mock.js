const language = ["nb", "nn", "en", "is"];
const grade = ["preschool", "primary", "secondary", "junior", "senior"];
const subject = [
  "mathematics",
  "science",
  "programming",
  "technology",
  "music",
  "first_language",
  "english",
  "arts_and_crafts",
  "social_science",
];
const topic = [
  "animation",
  "app",
  "block_based",
  "electronics",
  "cryptography",
  "sound",
  "minecraft",
  "web",
  "robot",
  "game",
  "step_based",
  "text_based",
];

module.exports = (username, course, title) => {
  let lessonData = {};
  lessonData.author = username;
  lessonData.course = course.toLowerCase();
  lessonData.title = title.toLowerCase();
  lessonData.language = language[Math.floor(Math.random() * language.length)];
  let yml = { tags: {} };
  yml.tags.grade = getRandomElements(
    grade,
    Math.floor(Math.random() * grade.length)
  );
  yml.tags.subject = getRandomElements(
    subject,
    Math.floor(Math.random() * subject.length)
  );
  yml.tags.topic = getRandomElements(
    topic,
    Math.floor(Math.random() * topic.length)
  );
  lessonData.yml = yml;
  return lessonData;
};

const getRandomElements = (a, r) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, r);
};
