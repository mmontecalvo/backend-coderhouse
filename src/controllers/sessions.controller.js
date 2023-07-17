class SessionsController {
    gitHubCallback(req, res) {
        req.session.user = req.user;
        res.redirect('/');
    }

    currentSession(req, res) {
        if(req.session.user) {
            return res.status(200).json({
                status: "success",
                message: "Logged in user.",
                data: req.session
            });
        } else {
            return res.status(400).json({
                status: "Error",
                message: "No logged in user.",
                data: {}
            });
        }
    }
}

export const sessionsController = new SessionsController();