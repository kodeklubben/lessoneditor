const loadSecrets = require("../backend/utils/load-secrets");
const name =
  "projects/739038449062/secrets/demo-password-and-user/versions/latest";

loadSecrets(name).then((secret) => {
  console.log(secret);
});
