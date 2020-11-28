const createFork = require("./createFork");
const upsertFile = require("./upsertFile");
const getMarkdownUrls = require("../utils/get-markdown-urls-submit");
const resolveMarkdownImageUrls = require("../utils/resolve-markdown-image-urls");
const downloadImage = require("../storage/download-image");
const ensureBranch = require("./ensureBranch");

module.exports = async (token, lessonData, branchName) => {
  const { owner, repo, status } = await createFork(token);
  if (status !== 202) {
    return status;
  }
  const { files } = lessonData;
  const { course, title } = lessonData.meta;
  if (!files) {
    console.warn("No lesson data files");
    return null;
  }

  const lessonPath = ["src", course, title].join("/");

  const filesToUpload = [];
  const filesToDownload = [];
  files.forEach((file) => {
    const path = [lessonPath, file.filename].join("/");
    if (file.ext === "yml") {
      filesToUpload.push({
        path,
        buffer: Buffer.from(file.content),
      });
    } else if (file.ext === "md") {
      const markdownContent = resolveMarkdownImageUrls(file.content);
      filesToUpload.push({
        path,
        buffer: Buffer.from(markdownContent),
      });
      filesToDownload.push(
        ...getMarkdownUrls(file.content).map(async (imgFile) => {
          filesToUpload.push({
            path: [lessonPath, imgFile.name].join("/"),
            buffer: await downloadImage(imgFile.url),
          });
        })
      );
    }
  });
  await Promise.all(filesToDownload);
  await ensureBranch(token, owner, repo, branchName);
  const uploadPromises = filesToUpload.map(
    async (file) =>
      await upsertFile(token, owner, repo, branchName, file.path, file.buffer)
  );
  console.log("stating uploading", uploadPromises);
  await Promise.all(uploadPromises);
  console.log("done uploading");
};
