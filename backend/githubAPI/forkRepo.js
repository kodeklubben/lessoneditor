const { Octokit } = require("@octokit/rest");

module.exports = async (token) => {
  const octokit = new Octokit({ auth: token });
  if (!(await isRepoForked(octokit))) {
    return await octokit.repos.createFork({
      owner: "kodeklubben",
      repo: "oppgaver",
    });
  }
  return { error: "Did not fork the repo since one already exists" };
};

// Checks if the Authenticated user owns a repo that is a fork of the name "oppgaver"
// Could use user info + source(or parent) from repos.get()
async function isRepoForked(octokit) {
  const response = await octokit.repos.listForAuthenticatedUser({
    visibility: "public",
    affiliation: "owner",
  });
  for (let repo in response.data) {
    if (
      response.data[repo].fork &&
      response.data[repo].name.match("oppgaver")
    ) {
      return true;
    }
  }
  return false;
}
