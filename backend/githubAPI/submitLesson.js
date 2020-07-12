const createFork = require("./forkRepo");
const upsertFile = require("./upsertFile");
const createPullRequest = require("./createPullRequest");
const resolveMarkdownUrls = require("../utils/resolve-markdown-urls-submit");
const downloadImage = require("../utils/download-image");
const yaml = require("yaml");

module.exports = async (lessonData, token) => {
  const lessonPath = `src/${lessonData.course}/${lessonData.title}`;
  const branchName = `${lessonData.course}/${lessonData.title}`;
  const ymlData = Buffer.from(yaml.stringify(lessonData.yml));
  const resolvedMarkdownUrlData = resolveMarkdownUrls(lessonData.markdown);
  try {
    const forkResponse = await createFork(token);
    const owner = forkResponse.data.owner.login;
    const repo = forkResponse.data.name;
    if (forkResponse.status !== 202) {
      return forkResponse.status;
    }
    // Commits .yml file
    const yamlRes = await upsertFile(
      token,
      owner,
      repo,
      branchName,
      `${lessonPath}/lesson.yml`,
      ymlData
    );
    if (yamlRes.status !== (201 || 200)) {
      return yamlRes.status;
    }
    // Commits image files
    if (resolvedMarkdownUrlData[2].length > 0) {
      for (let i in resolvedMarkdownUrlData[2]) {
        const imgBuffer = await downloadImage(resolvedMarkdownUrlData[2][i]);
        if (imgBuffer === null) {
          console.log("Could not find img.");
        } else {
          const imgRes = await upsertFile(
            token,
            owner,
            repo,
            branchName,
            `${lessonPath}/${resolvedMarkdownUrlData[1][i]}`,
            Buffer.from(imgBuffer, "binary")
          );
          if (imgRes.status !== (201 || 200)) {
            return imgRes.status;
          }
        }
      }
    }
    // Commits .md file
    const mdRes = await upsertFile(
      token,
      owner,
      repo,
      branchName,
      `${lessonPath}/${lessonData.title}_${lessonData.language}.md`,
      Buffer.from(resolvedMarkdownUrlData[0])
    );
    if (mdRes.status !== (201 || 200)) {
      return mdRes.status;
    }
    // Creates Pull request for a lesson
    //await createPullRequest(token, owner, lessonData.title, branchName, "Pull request from lesson editor");
    return 200;
  } catch (e) {
    return 400;
  }
};
