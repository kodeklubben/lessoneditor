const { Octokit } = require("@octokit/rest");

module.exports = async (token, path) => {
  const octokit = new Octokit({ auth: token });
  try {
    return await octokit.repos.getContent({
      owner: process.env.GITHUB_LESSON_REPO_OWNER,
      repo: process.env.GITHUB_LESSON_REPO,
      path,
    });
  } catch {
    console.log(`Path not found: ${path}`);
    return null;
  }
};
