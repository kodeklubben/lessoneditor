const express = require("express");
const path = require("path");
const app = express();
// const morgan = require("morgan");
// const bodyParser = require("body-parser");

// const lessonRoutes = require("./api/routes/lessons");
// const imageRoutes = require("./api/routes/images");

// app.use(morgan("dev"));
// app.use("/static/images", express.static("static/images"));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// Allow headers
// app.use((req, res, next) => {
//   // Allowing all headers might not be best practice?
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   if (req.method === "OPTIONS") {
//     res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
//     return res.status(200).json({});
//   }
//   next();
// });

//app.use("/lessons", lessonRoutes);
//app.use("/images", imageRoutes);

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
const buildFolder = path.resolve(__dirname, "..", "build");

module.exports = async () => {
  await require("./server/add-basic-auth")(app);
  app.use(express.static(buildFolder));
  require("./routes/uploads")(app);
  require("./routes/oppgaver.local")(app);
  app.get("*", function (request, response) {
    response.sendFile(path.resolve(buildFolder, "index.html"));
  });
  return app;
};
