import {Application} from "express";

const faker = require("faker");
const name = faker.name.findName();
const email = faker.internet.email();
/**
 * Her samler vi alle lokale tilpasninger for å kjøre uten innlogging.
 * @param app
 */
const authConfigLocal = (app: Application) => {
    process.env.THUMB_SERVICE_URL = "http://localhost:3012";
    process.env.GITHUB_CLIENT_SECRET = "123ABC";
    app.use(function (req, res, next) {
        req.user = {
            id: "fakeIdXXX",
            token: "fakeTokenXXX",
            name: name,
            email: email,
            photo: "https://via.placeholder.com/150",
            username: faker.helpers.slugify(name),
        };
        req.isAuthenticated = () => true;
        return next();
    });
};
export default authConfigLocal
