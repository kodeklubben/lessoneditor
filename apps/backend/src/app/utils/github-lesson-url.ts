const githubLessonUrl = (pathParts) => {
    const pathPartsClone = [...pathParts];
    pathPartsClone.unshift(
        "https://raw.githubusercontent.com",
        process.env.GITHUB_LESSON_REPO_OWNER,
        process.env.GITHUB_LESSON_REPO,
        "master/src"
    );
    return pathPartsClone.join("/");
};
export default githubLessonUrl
