import express from 'express';
import {login, signup, loginToken, emailPasswordReset, resetPassword, verifyEmail} from './auth';
import {googleAuthUrl, googleAuthCallback} from './oauthGoogle';
const authRouter = express.Router();

export default function makeAuthEndpoints(app) {
  app.use('/auth', authRouter);
  authRouter.route('/google').get(async (req, res) => {
    res.statusCode = 302;
    res.setHeader('Location', googleAuthUrl);
    res.setHeader('Content-Length', '0');
    res.end();
  });
  authRouter.route('/google/callback').get(googleAuthCallback);
}
