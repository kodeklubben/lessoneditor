const {Octokit} = require("@octokit/rest");

const createFork = async (token) => {
    const octokit = new Octokit({auth: token});
    const forkResponse = await octokit.repos.createFork({
        owner: process.env.GITHUB_LESSON_REPO_OWNER,
        repo: process.env.GITHUB_LESSON_REPO,
    });
    return {
        status: forkResponse.status,
        owner: forkResponse.data.owner.login,
        repo: forkResponse.data.name,
    };
}

export default createFork
