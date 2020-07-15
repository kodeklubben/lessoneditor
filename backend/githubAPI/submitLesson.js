const createFork = require("./forkRepo");
const upsertFile = require("./upsertFile");
const createPullRequest = require("./createPullRequest");
const getMarkdownUrls = require("../utils/get-markdown-urls-submit");
const resolveMarkdownImageUrls = require("../utils/resolve-markdown-image-urls");
const downloadImage = require("../utils/download-image");
const yaml = require("yaml");

module.exports = async (token, lessonData, path) => {
  if (lessonData === null) {
    console.log("No lesson data");
    return null;
  }
  const lessonPath = `src/${path.course}/${path.lesson}`;
  const branchName = `${path.course}/${path.lesson}`;
  console.log(lessonPath, branchName);
  const files = [
    {
      path: `${lessonPath}/lesson.yml`,
      buffer: Buffer.from(yaml.stringify(lessonData.yml)),
    },
  ];
  const markdownContent = resolveMarkdownImageUrls(lessonData.markdown);
  const markdownImageUrls = getMarkdownUrls(lessonData.markdown);
  for (let i in markdownImageUrls) {
    const buffer = await downloadImage(markdownImageUrls[i].url);
    if (buffer !== null) {
      files.push({
        path: `${lessonPath}/${markdownImageUrls[i].name}`,
        buffer: await downloadImage(markdownImageUrls[i].url),
      });
    }
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
