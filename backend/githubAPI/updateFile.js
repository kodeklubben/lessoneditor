const { Octokit } = require("@octokit/rest");

module.exports = async (
  token,
  username,
  repo,
  path /*will be replaced by generatePath*/,
  commitMessage,
  content,
  branch
) => {
  const octokit = new Octokit({ auth: token });
  const sha = await getFileSha(octokit, username, repo, path, branch);
  return await octokit.repos.createOrUpdateFileContents({
    owner: username,
    repo: repo,
    path: path,
    message: commitMessage,
    content: Buffer.from(content).toString("base64"),
    sha: sha,
    branch: branch,
  });
};

async function getFileSha(octokit, username, repo, path, branch) {
  const response = await octokit.repos.getContent({
    owner: username,
    repo: repo,
    path: path,
    ref: branch,
  });
  return response.data.sha;
}

/*// Could be executed before this module elsewhere
function generatePath(metaData) {
  // Todo: Genereate file path from metadata (coruse, lessonName, fileName.*
}*/
