const createFork = require("./forkRepo");
const upsertFile = require("./upsertFile");
const createPullRequest = require("./createPullRequest");
const getMarkdownUrls = require("../utils/get-markdown-urls-submit");
const resolveMarkdownImageUrls = require("../utils/resolve-markdown-image-urls");
const downloadImage = require("../storage/download-image");
const imageFormats = ["png", "jpeg", "jpg"];

module.exports = async (token, lessonData, baseUrl) => {
  if (lessonData.files === null) {
    console.log("No lesson data");
    return null;
  }
  const lessonPath = `src/${lessonData.meta.course}/${lessonData.meta.title}`;
  const branchName = `${lessonData.meta.lessonId}`; //Todo: Better branch names.
  const files = [];
  const seenImages = [];
  for (let i in lessonData.files) {
    if (lessonData.files[i].ext === "yml") {
      files.push({
        path: `${lessonPath}/${lessonData.files[i].filename}`,
        buffer: Buffer.from(lessonData.files[i].content),
      });
    } else if (lessonData.files[i].ext === "md") {
      const markdownContent = resolveMarkdownImageUrls(
        lessonData.files[i].content
      );
      const markdownImageUrls = await getMarkdownUrls(
        lessonData.files[i].content,
        lessonData.meta.lessonId,
        baseUrl
      );
      for (let i in markdownImageUrls) {
        if (!seenImages.includes(markdownImageUrls[i].name)) {
          const buffer = await downloadImage(markdownImageUrls[i].url);
          if (buffer !== null) {
            files.push({
              path: `${lessonPath}/${markdownImageUrls[i].name}`,
              buffer: buffer,
            });
            seenImages.push(markdownImageUrls[i].name);
          }
        }
      }
      files.push({
        path: `${lessonPath}/${lessonData.files[i].filename}`,
        buffer: Buffer.from(markdownContent),
      });
    } else {
      if (!imageFormats.includes(lessonData.files[i].ext)) {
        files.push({
          path: `${lessonPath}/${lessonData.files[i].filename}`,
          buffer: Buffer.from(lessonData.files[i].content),
        });
      }
    }
  }
  /*const forkResponse = await createFork(token);
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
  );*/
};
