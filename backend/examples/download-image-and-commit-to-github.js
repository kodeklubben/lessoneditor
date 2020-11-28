require("dotenv").config({ path: __dirname + "/.env" });
const upsertFile = require("../src/githubAPI/upsertFile");
const downloadImage = require("../src/storage/download-image");
const downloadImageAndCommitToGithub = async () => {
  const imageUrl =
    "https://lokeshdhakar.com/projects/lightbox2/images/image-3.jpg";
  const buffer = await downloadImage(imageUrl);
  const token = process.env.GITHUB_ACCESS_TOKEN;
  const username = process.env.GITHUB_USERNAME;
  const repo = "oppgaver";
  const path = "src/python/min-fine/image-9.jpg";
  const branch = "testing-upload-av-bilde";
  console.log({
    token,
    username,
    repo,
    path,
    branch,
  });
  const res = await upsertFile(token, username, repo, branch, path, buffer);
  console.log(res);
};

/**
 * Will ensure that a branch exists or create it
 */

downloadImageAndCommitToGithub();
