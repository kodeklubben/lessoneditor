const passport = require("passport");
module.exports = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated() || require("./whitelist").includes(req.path)) {
    return next();
  } else {
    req.session.redirectAfter = req.path;
    passport.authenticate("github", {
      scope: ["repo", "user:email"],
    })(req, res, next);
  }
};
