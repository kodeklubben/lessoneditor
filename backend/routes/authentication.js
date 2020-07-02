const paths = require("../../paths.json");
const passport = require("passport");
const session = require("express-session");

const GitHubStrategy = require("passport-github2").Strategy;
const ensureAuthenticated = require("../utils/ensure-authenticated");
const sessionStore = require("../storage/session-storage");
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});
console.log("GITHUB_CLIENT_ID", process.env.GITHUB_CLIENT_ID);
console.log("GITHUB_CALLBACK_URL", process.env.GITHUB_CALLBACK_URL);
const strategy = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
  },
  function (accessToken, refreshToken, user, done) {
    done(null, {
      id: user.id,
      token: accessToken,
      name: user.displayName,
      email: user.emails[0].value,
      photo: user.photos[0].value,
      username: user.name,
    });
  }
);
passport.use(strategy.name, strategy);

module.exports = (app) => {
  app.use(
    session({
      store: sessionStore(),
      secret: process.env.GITHUB_CLIENT_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(passport.initialize({}));
  app.use(passport.session({}));
  app.use(ensureAuthenticated);
  app.get(paths.AUTH_LOGIN_FAILED, (req, res) => {
    res.send("<code>Login failed, sorry.</code>");
  });
  app.get("/login-tests/display-user", ensureAuthenticated, (req, res) => {
    res.send(req.user);
  });

  app.get(
    paths.AUTH_CALLBACK,
    passport.authenticate(strategy.name, {
      failureRedirect: paths.AUTH_LOGIN_FAILED,
    }),
    (req, res) => res.redirect("/")
  );
};
