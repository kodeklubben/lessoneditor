const { Octokit } = require("@octokit/rest");

module.exports = async (token) => {
  const octokit = new Octokit({ auth: token });
  return await octokit.repos.createFork({
    owner: process.env.GITHUB_LESSON_REPO_OWNER,
    repo: process.env.GITHUB_LESSON_REPO,
  });
};
