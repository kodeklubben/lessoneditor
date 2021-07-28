import {Application} from "express";

const express = require("express");
const path = require("path");
const fs = require("fs");
const buildFolder = path.resolve(__dirname, "..", "frontend");

const serveFrontend = (app: Application) => {
    console.log({buildFolder});
    app.use(express.static(buildFolder, {index: false}));
    app.get("/*", function (req, res) {
        const indexHtmlLoc = path.join(buildFolder, "index.html");
        const indexHtmlContent = fs.readFileSync(indexHtmlLoc, "utf8");
        res.set("Cache-Control", "no-store");
        res.send(indexHtmlContent);
    });
};

export default serveFrontend
