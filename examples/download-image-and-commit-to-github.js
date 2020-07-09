const axios = require("axios");
const upsertFile = require("../backend/githubAPI/upsertFile");
const downloadImageAndCommitToGithub = async () => {
  const imageUrl =
    "https://i.picsum.photos/id/876/200/300.jpg?hmac=goKRzVFKqeXwTjZFK6d58HDkfv32_d-P_bPCS3Mtlf4";
  const response = await axios.get(imageUrl, {
    responseType: "arraybuffer",
  });
  const buffer = Buffer.from(response.data, "binary");
  const token = "xxx";
  const username = "xxx";
  const repo = "oppgaver";
  const path = "test/bilde/302.jpg";
  const branch = "testing-upload-av-bilde";
  await upsertFile(token, username, repo, branch, path, buffer);
};

/**
 * Will ensure that a branch exists or create it
 */

downloadImageAndCommitToGithub();
