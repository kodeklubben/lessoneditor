const { Octokit } = require("@octokit/rest");

const cache = [];
const getBranchCached = async (token, owner, repo, branch) => {
  const htmlLink = `https://github.com/${owner}/${repo}/tree/${branch}`;
  const existing = cache.find((data) => data._links.html === htmlLink);
  if (existing) {
    console.log("Getting branch from cache", htmlLink);
    return existing;
  } else {
    try {
      const octokit = new Octokit({ auth: token });
      const branchInfo = await octokit.repos.getBranch({
        owner,
        repo,
        branch,
      });
      console.log("Branch fetched, should caching the result", htmlLink);
      cache.push(branchInfo.data);
      return branchInfo.data;
    } catch (e) {
      if (e.status === 404) {
        return null;
      } else {
        throw e;
      }
    }
  }
};

module.exports = async (token, owner, repo, branch) => {
  const htmlLink = `https://github.com/${owner}/${repo}/tree/${branch}`;
  const branchData = await getBranchCached(token, owner, repo, branch);
  if (branchData === null) {
    console.log("Branch is not existing, creating", htmlLink);
    const masterBranch = await getBranchCached(token, owner, repo, "master");
    const octokit = new Octokit({ auth: token });
    await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branch}`,
      sha: masterBranch.commit.sha,
    });
    return await getBranchCached(token, owner, repo, branch);
  } else {
    console.log("Branch exists", htmlLink);
    return branchData;
  }
};
