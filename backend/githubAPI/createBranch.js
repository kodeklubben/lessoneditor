const { Octokit } = require("@octokit/rest");

module.exports = async (token, username, repo, branch) => {
  const octokit = new Octokit({ auth: token });
  const sha = await getRepoMasterSha(octokit, username, repo);
  return await octokit.git.createRef({
    owner: username,
    repo: repo,
    ref: `refs/heads/${branch}`,
    sha: sha,
  });
};

async function getRepoMasterSha(octokit, username, repo) {
  const response = await octokit.repos.getBranch({
    owner: username,
    repo: repo,
    branch: "master",
  });
  return response.data.commit.sha;
}
