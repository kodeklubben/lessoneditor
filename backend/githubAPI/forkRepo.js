const { Octokit } = require("@octokit/rest");

module.exports = async (token) => {
  const octokit = new Octokit({ auth: token });
  return await octokit.repos.createFork({
    owner: "kodeklubben",
    repo: "oppgaver",
  });
};
