const session = require("express-session");
const sessionStore = require("./session-storage");
const isAppEngine = require("../utils/isAppEngine");

module.exports = session({
  store: sessionStore(),
  secret: process.env.GITHUB_CLIENT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isAppEngine(),
    maxAge: 86400000, // one day in milliseconds
  },
});
