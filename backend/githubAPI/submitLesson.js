const createFork = require("./forkRepo");
const upsertFile = require("./upsertFile");
const createPullRequest = require("./createPullRequest");
const getMarkdownUrls = require("../utils/get-markdown-urls-submit");
const resolveMarkdownImageUrls = require("../utils/resolve-markdown-image-urls");
const downloadImage = require("../utils/download-image");

module.exports = async (token, lessonData) => {
  if (lessonData.files === null) {
    console.log("No lesson data");
    return null;
  }
  const lessonPath = `src/${lessonData.meta.course}/${lessonData.meta.title}`;
  const branchName = `${lessonData.meta.lessonId}`; //Todo: Better branch names.
  const files = [];
  for (let i in lessonData.files) {
    if (lessonData.files[i].ext === "yml") {
      files.push({
        path: `${lessonPath}/${lessonData.files[i].filename}`,
        buffer: Buffer.from(lessonData.files[i].content),
      });
    } else {
      const markdownContent = resolveMarkdownImageUrls(
        lessonData.files[i].content
      );
      const markdownImageUrls = getMarkdownUrls(lessonData.files[i].content);
      for (let i in markdownImageUrls) {
        const buffer = await downloadImage(markdownImageUrls[i].url);
        if (buffer !== null) {
          files.push({
            path: `${lessonPath}/${markdownImageUrls[i].name}`,
            buffer: buffer,
          });
        }
      }
      files.push({
        path: `${lessonPath}/${lessonData.files[i].filename}`,
        buffer: Buffer.from(markdownContent),
      });
    }
  }
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
  return await createPullRequest(
    token,
    owner,
    lessonData.meta.title,
    branchName,
    "Pull request from lesson editor"
  );
};
