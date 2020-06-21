const { Octokit } = require("@octokit/rest");

module.exports = async (token, username, title, branch, body) => {
  const octokit = new Octokit({ auth: token });
  return await octokit.pulls.create({
    owner: "kodeklubben",
    repo: "oppgaver",
    title: title, // title of PR
    head: `${username}:${branch}`,
    base: "master",
    body: body, // PR message
  });
};
