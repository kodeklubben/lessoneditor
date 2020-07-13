const bodyParser = require("body-parser");
module.exports = (app) => {
  app.use(bodyParser.json());
  app.use(bodyParser.text());
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
