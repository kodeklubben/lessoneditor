const createFork = require("./createFork");
const updateLesson = require("./updateLesson");
const createPullRequest = require("./createPullRequest");

module.exports = async (token, lessonData) => {
  const { owner } = await createFork(token);
  const { title, lessonId } = lessonData.meta;
  const branchName = lessonId; //Todo: Better branch names.
  await updateLesson(token, lessonData, branchName);
  if (false) {
    return await createPullRequest(
      token,
      owner,
      title,
      branchName,
      "Pull request from lesson editor"
    );
  } else {
    return {
      status: 201,
      data: {
        html: "http://example.com/example-url",
      },
    };
  }
};
