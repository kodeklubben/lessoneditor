const init = require("./app");
const port = process.env.PORT || 5000;

init().then((app) => {
  app.listen(port, () => console.log(`Server listening on port ${port}`));
});
