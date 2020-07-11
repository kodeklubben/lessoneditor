const createFork = require("./forkRepo");
const createBranch = require("./createBranch");
const upsertFile = require("./upsertFile");
const createPullRequest = require("./createPullRequest");
const yaml = require("yaml");
const owner = "xxx";

module.exports = async (lessonData, token) => {
  const lessonPath = `src/${lessonData.course}/${lessonData.title}`;
  const branchName = `${lessonData.course}/${lessonData.title}`;
  const ymlData = Buffer.from(yaml.stringify(lessonData.yml));
  try {
    const forkResponse = await createFork(token);
    if (forkResponse.status !== 202) {
      return forkResponse.status;
    }
    await upsertFile(
      token,
      owner,
      forkResponse.data.name,
      branchName,
      lessonPath + ".yml",
      ymlData
    );

    return 200;
  } catch (e) {
    if (e) throw e;
  }
};
