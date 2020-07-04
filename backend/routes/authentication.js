const paths = require("../../paths.json");
const passport = require("passport");

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));
passport.use("github", require("../authentication/strategy"));

module.exports = (app) => {
  app.set("trust proxy", 1);
  app.use(require("../authentication/session"));
  app.use(passport.initialize({}));
  app.use(passport.session({}));
  app.use(require("../authentication/ensure-authenticated"));
  app.get(paths.AUTH_LOGIN_FAILED, (req, res) =>
    res.send("<code>Login failed, sorry.</code>")
  );
  app.get("/login-tests/display-user", (req, res) => res.send(req.user));
  app.get(
    paths.AUTH_CALLBACK,
    passport.authenticate("github", {
      failureRedirect: paths.AUTH_LOGIN_FAILED,
    }),
    (req, res) => res.redirect(req.session.redirectAfter || "/")
  );
};
