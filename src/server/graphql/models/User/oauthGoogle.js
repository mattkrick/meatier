import promisify from 'es6-promisify';
import google from 'googleapis';
import Schema from '../../rootSchema';
import {graphql} from 'graphql';

const OAuth2 = google.auth.OAuth2;
const oauth = google.oauth2('v2'); // v3 should come out soonish

export const oauth2Client = new OAuth2(process.env.GOOGLE_CLIENTID, process.env.GOOGLE_SECRET, process.env.GOOGLE_CALLBACK);
const getToken = promisify(oauth2Client.getToken.bind(oauth2Client));
const getUserInfo = promisify(oauth.userinfo.get.bind(oauth.userinfo));

export const googleAuthUrl = oauth2Client.generateAuthUrl({
  // approval_prompt: "force", //get the refresh_token every time (for debugging only)
  // access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
  scope: ['email', 'profile'] // If you only need one scope you can pass it as string
});

const userWithAuthToken = `
{
  user {
    id,
    email,
    strategies {
      local {
        isVerified
      },
      google {
        id,
        email,
        isVerified,
        name,
        firstName,
        lastName,
        picture,
        gender,
        locale
      }
    }
  },
  authToken
}`;

export async function googleAuthCallback(req, res) {
  const query = `
  mutation($profile: GoogleProfile!){
     payload: loginWithGoogle(profile: $profile)
     ${userWithAuthToken}
  }`;
  const [googleTokens] = await getToken(req.query.code); // ignore response
  oauth2Client.setCredentials(googleTokens);
  const [profile] = await getUserInfo({auth: oauth2Client});
  const result = await graphql(Schema, query, null, {profile});
  const objToSend = JSON.stringify(result);
  res.send(objToSend);
}
