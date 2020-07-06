const GitHubStrategy = require("passport-github2").Strategy;

module.exports = new GitHubStrategy(
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
      username: user.username,
    });
  }
);
