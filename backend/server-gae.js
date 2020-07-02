const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const init = require("./app");
const port = process.env.PORT || 3232;

init().then((app) => {
  app.listen(port, () =>
    console.log(`Server(GAE) is running on http://localhost:${port}`)
  );
});
