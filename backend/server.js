const init = require("./app");
const port = process.env.PORT || 3232;

init().then((app) => {
  app.listen(port, () =>
    console.log(`Server(GAE) is running on http://localhost:${port}`)
  );
});
