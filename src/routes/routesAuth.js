import express from 'express';
import passport from 'passport';
import {
    registerUser,
    loginUser,
    logoutUser,
    githubCallback,
    getCurrentUser,
    requestPasswordResetController,  // Asegúrate de usar el nombre correcto
    renderResetPasswordPage,
    resetPassword
} from '../controllers/auth.controller.js';
import { 
    isAuthenticated,
    isAdmin
 } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), githubCallback);
router.get('/current', isAuthenticated, getCurrentUser);  // Protect the route

// Password reset routes
router.post('/request-password-reset', requestPasswordResetController);
router.get('/reset-password/:token', renderResetPasswordPage);
router.post('/reset-password/:token', resetPassword);

export default router;