const jwt = require("jsonwebtoken");

module.exports = (username, secret) => {
  return jwt.sign({ sub: username }, secret);
};
