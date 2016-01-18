import express from 'express';
import {googleAuthUrl, googleAuthCallback} from './../graphql/models/User/oauthGoogle';
const authRouter = express.Router();

export default function makeAuthEndpoints(app) {
  app.use('/auth', authRouter);
  authRouter.route('/google').get(async (req, res) => {
    res.redirect(googleAuthUrl);
  });
  authRouter.route('/google/callback').get(googleAuthCallback);
}
