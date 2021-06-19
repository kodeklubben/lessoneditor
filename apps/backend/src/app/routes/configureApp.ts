const bodyParser = require("body-parser");
const configureApp = (app) => {
    app.use(bodyParser.json());
    app.use(bodyParser.text());
};

export default configureApp;
