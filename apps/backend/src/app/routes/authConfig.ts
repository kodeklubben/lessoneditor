import * as passport from "passport";
import appSession from "../auth/session";
import ensureAuthenticated from "../auth/ensure-authenticated";
import {paths} from "@lessoneditor/api-interfaces";
import githubStrategy from "../auth/strategy";


passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));
passport.use("github", githubStrategy);

const authConfig = (app) => {
    app.set("trust proxy", 1);
    app.use(appSession);
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(ensureAuthenticated);
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
export default authConfig
