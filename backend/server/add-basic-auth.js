const basicAuth = require("express-basic-auth");
const loadSecrets = require("../utils/load-secrets");
const secretId =
  "projects/739038449062/secrets/demo-password-and-user/versions/latest";

module.exports = async (app) => {
  const credentials = await loadSecrets(secretId);
  console.log("Secrets loaded for user:", credentials.user);
  app.use(
    basicAuth({
      users: {
        [credentials.user]: credentials.pass,
      },
      challenge: true,
      realm: "lessoneditor",
      unauthorizedResponse: () => ({
        feil: "ikke tilgang",
      }),
    })
  );
};
