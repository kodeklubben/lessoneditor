import {paths, User} from "@lessoneditor/api-interfaces";
import {Application} from "express";


const currentUser = (app: Application) => {
    app.get(paths.USER, async (req, res) => {
        res.send({
            authenticated: req.isAuthenticated(),
            // @ts-ignore
            email: req.user.email,
            // @ts-ignore
            name: req.user.name,
            // @ts-ignore
            username: req.user.username,
            // @ts-ignore
            photo: req.user.photo,
        });
    });
}

export default currentUser
