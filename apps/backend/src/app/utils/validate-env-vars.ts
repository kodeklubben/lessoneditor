import validUrl from "./valid-url";


const validateEnvVars = async (envVars) => {
    const shouldBeDefined = [
        "GITHUB_CLIENT_ID",
        "GITHUB_CALLBACK_URL",
        "GITHUB_CLIENT_SECRET",
        "GITHUB_LESSON_REPO_OWNER",
        "GITHUB_LESSON_REPO",
        "BUCKET",
    ];
    const shouldBeUrl = ["GITHUB_CALLBACK_URL", "THUMB_SERVICE_URL"];
    shouldBeDefined.forEach((envVar) => {
        if (!envVars[envVar]) {
            throw Error(envVar + " should be defined");
        }
    });
    shouldBeUrl.forEach((envVar) => {
        if (!validUrl(envVars[envVar])) {
            throw Error(envVar + " should be an url.");
        }
    });
};

export default validateEnvVars
