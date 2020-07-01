const passport = require("passport");
module.exports = function ensureAuthenticated(req, res, next) {
  const whitelisted = ["/callback", "/login-failed"];
  if (req.isAuthenticated() || whitelisted.includes(req.path)) {
    return next();
  } else {
    passport.authenticate("github", {
      scope: ["repo", "user:email"],
    })(req, res, next);
  }
};
