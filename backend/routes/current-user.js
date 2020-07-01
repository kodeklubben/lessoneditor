const paths = require("../../paths.json");
module.exports = (app) => {
  app.get(paths.CURRENT_USER, async (req, res) => {
    res.send({
      authenticated: req.isAuthenticated(),
      email: req.user.email,
      name: req.user.name,
      photo: req.user.photo,
    });
  });
};
