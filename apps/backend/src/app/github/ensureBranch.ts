const {Octokit} = require("@octokit/rest");

const cache = new Map();
const getBranchCached = async (token, owner, repo, branch) => {
    const cacheKey = JSON.stringify({owner, repo, branch});
    if (cache.has(cacheKey)) {
        console.log("Getting branch from cache", cacheKey);
        return cache.get(cacheKey);
    } else {
        try {
            const octokit = new Octokit({auth: token});
            const branchInfo = await octokit.repos.getBranch({
                owner,
                repo,
                branch,
            });
            console.log("Branch fetched, should caching the result", cacheKey);
            cache.set(cacheKey, branchInfo.data);
            return cache.get(cacheKey);
        } catch (e) {
            if (e.status === 404) {
                console.log("Couldn't find branch", cacheKey);
                return null;
            } else {
                throw e;
            }
        }
    }
};

const ensureBranch = async (token, owner, repo, branch) => {
    const branchData = await getBranchCached(token, owner, repo, branch);
    if (branchData === null) {
        console.log("Branch is not existing, creating", {owner, repo, branch});
        const masterBranch = await getBranchCached(token, owner, repo, "master");
        const octokit = new Octokit({auth: token});
        await octokit.git.createRef({
            owner,
            repo,
            ref: `refs/heads/${branch}`,
            sha: masterBranch.commit.sha,
        });
        return await getBranchCached(token, owner, repo, branch);
    } else {
        console.log("Branch exists", {owner, repo, branch});
        return branchData;
    }
};
export default ensureBranch
