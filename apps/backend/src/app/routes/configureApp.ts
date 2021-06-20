import {Application} from "express";

const bodyParser = require("body-parser");
const configureApp = (app: Application) => {
    app.use(bodyParser.json());
    app.use(bodyParser.text());
};

export default configureApp;
