const paths = require("../../paths.json");
const faker = require("faker");
const name = faker.name.findName();
const email = faker.internet.email();
module.exports = (app) => {
  app.get(paths.CURRENT_USER, async (req, res) => {
    res.send({
      authenticated: true,
      email,
      name,
    });
  });
};
