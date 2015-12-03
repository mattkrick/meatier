import {googleClientID, googleClientSecret, googleCallbackURL} from '../secrets';
const google = require('googleapis');
const OAuth2 = google.auth.OAuth2;
export const oauth2Client = new OAuth2(googleClientID, googleClientSecret, googleCallbackURL);

const scopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];

export const googleAuthUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
  scope: scopes // If you only need one scope you can pass it as string
});

export const googleAuthCallback = (req, res) => {
  oauth2Client.getToken(req.query.code, function (err, tokens) {
    // Now tokens contains an access_token and an optional refresh_token. Save them.
    if (!err) {
      oauth2Client.setCredentials(tokens);
      oauth.userinfo.get({auth: oauth2Client}, function (err, resp) {
        console.log('resp',resp);
      });
    }
  });
  res.redirect('/');
}
