const createFork = require("./forkRepo");
const upsertFile = require("./upsertFile");
const createPullRequest = require("./createPullRequest");
const resolveMarkdownUrls = require("../utils/resolve-markdown-urls-submit"); // endre navn
const resolveMarkdownImageUrls = require("../utils/resolve-markdown-image-urls");
const downloadImage = require("../utils/download-image");
const yaml = require("yaml");

module.exports = async (token, lessonData) => {
  const lessonPath = `src/${lessonData.course}/${lessonData.title}`;
  const branchName = `${lessonData.course}/${lessonData.title}`;
  const files = [
    {
      path: `${lessonPath}/lesson.yml`,
      buffer: Buffer.from(yaml.stringify(lessonData.yml)),
    },
  ];
  const markdownContent = resolveMarkdownUrls(lessonData.markdown);
  const markdownImageUrls = resolveMarkdownImageUrls(lessonData.markdown);
  for (let i in markdownImageUrls) {
    files.push({
      path: `${lessonPath}/${markdownImageUrls[i].name}`,
      buffer: await downloadImage(markdownImageUrls[i].url),
    });
  }
  files.push({
    path: `${lessonPath}/${lessonData.title}_${lessonData.language}.md`,
    buffer: Buffer.from(markdownContent),
  });
  const forkResponse = await createFork(token);
  const owner = forkResponse.data.owner.login;
  const repo = forkResponse.data.name;
  if (forkResponse.status !== 202) {
    return forkResponse.status;
  }
  for (let i in files) {
    await upsertFile(
      token,
      owner,
      repo,
      branchName,
      files[i].path,
      files[i].buffer
    );
  }
  await createPullRequest(
    token,
    owner,
    lessonData.title,
    branchName,
    "Pull request from lesson editor"
  );
};
