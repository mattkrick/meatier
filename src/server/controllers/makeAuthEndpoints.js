import express from 'express';
import {login, signup, loginToken, sendResetEmail, resetPassword, verifyEmail} from './auth';
import {googleAuthUrl, googleAuthCallback} from './oauthGoogle';
const authRouter = express.Router();

export default function makeAuthEndpoints(app) {
  app.use('/auth', authRouter);
  authRouter.route('/login').post(login);
  authRouter.route('/login-token').post(loginToken);
  authRouter.route('/signup').post(signup);
  authRouter.route('/send-reset-email').post(sendResetEmail);
  authRouter.route('/reset-password').post(resetPassword);
  authRouter.route('/verify-email').post(verifyEmail);
  authRouter.route('/google').get(async (req, res) => {
    res.statusCode = 302;
    res.setHeader('Location', googleAuthUrl);
    res.setHeader('Content-Length', '0');
    res.end();
  });
  authRouter.route('/google/callback').get(googleAuthCallback);
}
