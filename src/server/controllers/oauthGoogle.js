import {googleClientID, googleClientSecret, googleCallbackURL} from '../secrets';
import promisify from 'es6-promisify';
import google from 'googleapis';
import {loginWithGoogleDB} from '../database/models/oauthGoogle';
import {signJwt} from './auth';

const OAuth2 = google.auth.OAuth2;
const oauth = google.oauth2('v2'); //v3 should come out soonish

export const oauth2Client = new OAuth2(googleClientID, googleClientSecret, googleCallbackURL);
const getToken = promisify(oauth2Client.getToken.bind(oauth2Client));
const getUserInfo = promisify(oauth.userinfo.get.bind(oauth.userinfo));
const scopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];

export const googleAuthUrl = oauth2Client.generateAuthUrl({
  //approval_prompt: "force", //get the refresh_token every time (for debugging only)
  //access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
  scope: scopes // If you only need one scope you can pass it as string
});

export async function googleAuthCallback(req, res) {
  let googleTokens, googleProfile, user;
  try {
    [googleTokens] = await getToken(req.query.code); //ignore response
  } catch (e) {
    return res.status(401).json({error: {_error: e.message}})
  }
  oauth2Client.setCredentials(googleTokens);
  try {
    [googleProfile] = await getUserInfo({auth: oauth2Client})
  } catch (e) {
    return res.status(401).json({error: {_error: e.message}})
  }
  try {
    user = await loginWithGoogleDB(googleProfile)
  } catch (e) {
    return res.status(401).json({error: {_error: e.message}})
  }
  const authToken = signJwt(user);

  //ugly way to work around fetch being lame
  const objToSend = JSON.stringify({authToken, user});
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(objToSend)
  });
  res.end(objToSend);
}
