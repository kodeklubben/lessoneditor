const { Octokit } = require("@octokit/rest");

module.exports = async (token, username, title, branch, body) => {
  try {
    const octokit = new Octokit({ auth: token });
    return await octokit.pulls.create({
      owner: process.env.GITHUB_LESSON_REPO_OWNER,
      repo: process.env.GITHUB_LESSON_REPO,
      title: title, // title of PR
      head: `${username}:${branch}`,
      base: "master",
      body: body, // PR message
    });
  } catch (e) {
    if (e.status === 404) {
      return null;
    } else {
      throw e;
    }
  }
};
