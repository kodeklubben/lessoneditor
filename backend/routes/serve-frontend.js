const express = require("express");
const path = require("path");
const buildFolder = path.resolve(__dirname, "..", "..", "build");
module.exports = (app) => {
  app.use(express.static(buildFolder));
};
