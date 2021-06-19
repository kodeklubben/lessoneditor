const setupServer = function (app) {
    require("./routes/authConfig").default(app);
    require("./routes/configureApp").default(app);
    require("./routes/current-user").default(app);
    require("./routes/current-user-lessons").default(app);
    require("./routes/lesson-create").default(app);
    require("./routes/lesson-data").default(app);
    require("./routes/lesson-edit").default(app);
    require("./routes/lesson-files").default(app);
    require("./routes/lesson-proxy").default(app);
    require("./routes/lesson-submit").default(app);
    require("./routes/lesson-thumb").default(app);
    require("./routes/lesson-uploads").default(app);
    require("./routes/serve-file").default(app);
    require("./routes/serve-frontend").default(app);
};

export default setupServer;
