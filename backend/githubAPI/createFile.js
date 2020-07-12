const { Octokit } = require("@octokit/rest");

// Remember to save SHA for file update.
module.exports = async (
  token,
  username,
  repo,
  path /*will be replaced by generatePath*/,
  commitMessage,
  buffer,
  branch
) => {
  const octokit = new Octokit({ auth: token });
  return await octokit.repos.createOrUpdateFileContents({
    owner: username,
    repo: repo,
    path: path,
    message: commitMessage,
    content: buffer.toString("base64"),
    branch: branch,
  });
};
