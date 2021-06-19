import sessionStorage from "./session-storage";
import isAppEngine from "../utils/isAppEngine";
import * as expressSession from "express-session"


const appSession = expressSession({
    store: sessionStorage(),
    secret: process.env.GITHUB_CLIENT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: isAppEngine(),
        maxAge: 86400000, // one day in milliseconds
    },
})

export default appSession;
