module.exports = (app) => {
  app.use(function (req, res, next) {
    req.user = {
      id: "fakeId",
      token: "xxx",
      name: "Tore Toresen",
      email: "tore@hotmail.com",
      photo: "",
      username: "tore1337",
    };
    return next();
  });
};
