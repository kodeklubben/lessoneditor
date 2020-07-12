const { Octokit } = require("@octokit/rest");

module.exports = async (token, username, title, branch, body) => {
  try {
    const octokit = new Octokit({ auth: token });
    return await octokit.pulls.create({
      owner: "kodeklubben",
      repo: "oppgaver",
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
