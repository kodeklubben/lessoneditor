import {paths} from "@lessoneditor/api-interfaces";


const currentUser = (app) => {
    app.get(paths.USER, async (req, res) => {
        res.send({
            authenticated: req.isAuthenticated(),
            email: req.user.email,
            name: req.user.name,
            username: req.user.username,
            photo: req.user.photo,
        });
    });
}

export default currentUser
