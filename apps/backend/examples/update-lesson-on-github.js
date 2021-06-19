require("dotenv").config({ path: __dirname + "/.env" });

const updateLesson = require("../src/githubAPI/updateLesson");
const lessonData = require("../test-utils/create-lesson-data")();
const updateLessonOnGithub = async () => {
  const token = process.env.GITHUB_ACCESS_TOKEN;
  const branchName = "testing-upload-av-bilde";
  console.log({
    token,
    lessonData,
    branchName,
  });
  const status = await updateLesson(token, lessonData, branchName);
  console.log(status);
};

/**
 * Will ensure that a branch exists or create it
 */

updateLessonOnGithub();
