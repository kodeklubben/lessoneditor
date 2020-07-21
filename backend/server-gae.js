const path = require("path");
const isAppEngine = require("./utils/isAppEngine");
const envFile = isAppEngine() ? ".env" : ".env.local";
require("dotenv").config({
  path: path.join(__dirname, envFile),
});
const init = require("./app");
const port = process.env.PORT || 3232;

console.log("GITHUB_CLIENT_ID", process.env.GITHUB_CLIENT_ID);
console.log("GITHUB_CALLBACK_URL", process.env.GITHUB_CALLBACK_URL);
init().then(async (app) => {
  await app.listen(port);
  console.log(`Server(GAE) is running on http://localhost:${port}`);
});
