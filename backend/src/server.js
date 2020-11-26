const path = require("path");
const isAppEngine = require("./utils/isAppEngine");
const validateEnvVars = require("./utils/validate-env-vars");
const getTempDir = require("./utils/get-temp-dir");
const app = require("express")();
const setupServer = require("./setupServer");
const envFile = isAppEngine() ? ".env" : ".env.local";
require("dotenv").config({
  path: path.join(__dirname, "..", envFile),
});
validateEnvVars(process.env);
console.log("GITHUB_CLIENT_ID", process.env.GITHUB_CLIENT_ID);
console.log("GITHUB_CALLBACK_URL", process.env.GITHUB_CALLBACK_URL);
setupServer(app);
const port = process.env.PORT || 3232;
app.listen(port, () => {
  console.log(`Server(GAE) is running on http://localhost:${port}`);
  if (!isAppEngine()) {
    console.log("Using temp dir:", getTempDir([]));
  }
});
