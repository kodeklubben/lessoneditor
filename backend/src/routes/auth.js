const paths = require("../paths");
const passport = require("passport");

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));
passport.use("github", require("../auth/strategy"));

module.exports = (app) => {
  app.set("trust proxy", 1);
  app.use(require("../auth/session"));
  app.use(passport.initialize({}));
  app.use(passport.session({}));
  app.use(require("../auth/ensure-authenticated"));
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
