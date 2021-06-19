import {authenticate} from "passport";
import whitelist from "./whitelist";
import verifyJwtToken from "./verify-jwt-token";


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated() || whitelist.includes(req.path)) {
        return next();
    } else if (req.headers.authorization) {
        const [type, token] = req.headers.authorization.split(" ");
        const verification = verifyJwtToken(token);
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
        authenticate("github", {
            scope: ["repo", "user:email"],
        })(req, res, next);
    }
}

export default ensureAuthenticated
