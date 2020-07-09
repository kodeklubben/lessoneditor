const { Octokit } = require("@octokit/rest");
const ensureBranch = require("./ensureBranch");

module.exports = async (token, owner, repo, branch, path, buffer) => {
  await ensureBranch(token, owner, repo, branch);
  const fileContent = await getContentCached(token, owner, repo, branch, path);
  const octokit = new Octokit({ auth: token });
  const content = buffer.toString("base64");
  if (fileContent) {
    // just to a quick comparision to avoid updating files that are actually the same.
    const x = Buffer.compare(
      Buffer.from(fileContent.content, "base64"),
      buffer
    );
    if (x === 0) {
      console.log("No update for " + path + " content is equal.");
      return null;
    } else {
      const message = "Updates " + path + " with lessoneditor.";
      console.log(message);
      return await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        branch,
        message,
        content,
        sha: fileContent.sha,
      });
    }
  } else {
    const message = "Creating " + path + " with lessoneditor.";
    console.log(message);
    return await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      branch,
      message,
      content,
    });
  }
};
const cache = [];

async function getContentCached(token, owner, repo, ref, path) {
  const octokit = new Octokit({ auth: token });
  try {
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref,
    });
    cache.push({
      path: response.data.path,
      sha: response.data.sha,
    });
    return response.data;
  } catch (e) {
    if (e.status === 404) {
      return null;
    } else {
      throw e;
    }
  }
  return;
}
