import { Router } from "express";
import passport from "passport";
import { sessionsController } from "../controllers/sessions.controller.js";

const sessionsRouter = Router();

// ENDPOINTS SESSIONS

sessionsRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

sessionsRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/auth/login' }), sessionsController.gitHubCallback);

sessionsRouter.get('/current', sessionsController.currentSession);

export default sessionsRouter;