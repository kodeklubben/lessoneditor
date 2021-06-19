const {Octokit} = require("@octokit/rest");

const createPullRequest = async (token, username, title, branch, body) => {
    try {
        const octokit = new Octokit({auth: token});
        console.log("Creating pull request.");
        return await octokit.pulls.create({
            owner: process.env.GITHUB_LESSON_REPO_OWNER,
            repo: process.env.GITHUB_LESSON_REPO,
            title: title, // title of PR
            head: `${username}:${branch}`,
            base: "master",
            body: body, // PR message
        });
    } catch (e) {
        if (e.status === 422) {
            console.log("Pull request already exists.");
            return e;
        } else {
            throw e;
        }
    }
};
export default createPullRequest
