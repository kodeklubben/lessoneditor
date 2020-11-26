const isAppEngine = require("./utils/isAppEngine");

module.exports = isAppEngine()
  ? require("../../paths.json")
  : require("../../frontend/src/paths.json");
