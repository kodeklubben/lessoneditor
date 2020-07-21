const passport = require("passport");
const verifyToken = require("./verify-jwt-token");
module.exports = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated() || require("./whitelist").includes(req.path)) {
    return next();
  } else if (req.headers.authorization) {
    const [type, token] = req.headers.authorization.split(" ");
    const verification = verifyToken(token);
    if (verification.valid) {
      req.user = {
        username: verification.data.sub,
      };
      return next();
    } else {
      res.status(401).send(verification.error);
    }
  } else {
    req.session.redirectAfter = req.path;
    passport.authenticate("github", {
      scope: ["repo", "user:email"],
    })(req, res, next);
  }
};
