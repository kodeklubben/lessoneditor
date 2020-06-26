const express = require("express");
const path = require("path");
const app = express();
const buildFolder = path.resolve(__dirname, "..", "build");

app.use(express.static(buildFolder));
require("./routes/uploads.mock")(app);
require("./routes/oppgaver.mock")(app);
//require("./routes/github-login")(app);
const port = 3421;
app.listen(3421, () => console.log(`Server listening on port ${port}`));
