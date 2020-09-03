const bodyParser = require("body-parser");
const downloadImage = require("../storage/download-image");
const saveFile = require("../storage/save-file");
const getRepoContent = require("../githubAPI/getRepoContent");
const scratchDefaults = async () => {
  const files = await getRepoContent(["scratch", "bilder"]);
  if (files.data) {
    for (const file of files.data) {
      const buffer = await downloadImage(file.download_url);
      await saveFile(["bilder", file.name], buffer);
    }
  }
};
module.exports = (app) => {
  app.use(bodyParser.json());
  app.use(bodyParser.text());
  scratchDefaults().then(() => console.log("Added scratch defaults"));
  // app.use((req, res, next) => {
  //   const error = new Error("Not found");
  //   error.status = 404;
  //   next(error);
  // });
  //
  // app.use((error, req, res, next) => {
  //   res.status(error.status || 500);
  //   res.json({
  //     error: {
  //       message: error.message,
  //     },
  //   });
  // });
};
