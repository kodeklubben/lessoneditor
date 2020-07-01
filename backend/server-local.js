const app = require("express")();
const port = process.env.PORT || 3232;
require("./routes/current-user.local")(app);
require("./routes/oppgaver.local")(app);
require("./routes/serve-frontend")(app);
require("./routes/uploads.local")(app);

app.listen(3421, () =>
  console.log(`Server(Local) is running on http://localhost:${port}`)
);
