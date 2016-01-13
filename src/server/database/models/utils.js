import crypto from 'crypto';
import {User} from './localStrategy';

/*if login fails with 1 strategy, suggest another*/
export function getAltLoginMessage(userStrategies = {}) {
  const authTypes = Object.keys(userStrategies);
  let authStr = authTypes.reduce((reduction, type) => reduction + `${type}, or `, 'Try logging in with ');
  authStr = authStr.slice(0, -5).replace('local', 'your password');
  return authTypes.length ? authStr : 'Create a new account';
}

/*a secret token has the user id, an expiration, and a secret
 the expiration allows for invalidating on the client or server. No need to hit the DB with an expired token
 the user id allows for a quick db lookup in case you don't want to index on email (also eliminates pii)
 the secret keeps out attackers (proxy for rate limiting, IP blocking, still encouraged)
 storing it in the DB means there exists only 1, one-time use key, unlike a JWT, which has many, multi-use keys*/
export function makeSecretToken(userId, minutesToExpire) {
  return new Buffer(JSON.stringify({
    id: userId,
    sec: crypto.randomBytes(8).toString('base64'),
    exp: Date.now() + 1000 * 60 * minutesToExpire
  })).toString("base64");
}

export async function getUserByEmail(email) {
  let users;
  try {
    users = await User.getAll(email, {index: 'email'}).limit(1).run();
  } catch (e) {
    throw e;
  }
  return users[0];
}

export function getSafeUser(userDoc) {
  const {id, email, strategies} = userDoc;
  return {
    id,
    email,
    strategies: getSafeStrategies(strategies)
  }
}

function getSafeStrategies(strategies) {
  const safeStrategies = {};
  const {local, google} = strategies;
  if (local) safeStrategies.local = safeLocalStrategy(local)
  if (google) safeStrategies.google = safeGoogleStrategy(google)
  return safeStrategies;
}

function safeLocalStrategy(localStrategy) {
  return {
    isVerified: localStrategy.isVerified
  }
}

function safeGoogleStrategy(googleStrategy) {
  /*  As is, we can share everything with the client
   We don't store a refresh_token because those don't expire so storing them opens us up to attacks
   we don't store an access_token because they expire in 1 hour
   we don't store an id_token because they expire in 1 hour (and we issue our own, 7 day token)
   if we needed authorization (eg facebook friends list) we could grab it immediately & store it in the DB
   if we needed authorization that updates before token expiration,
   we'd store the id_token in localStorage & refresh it from an in-memory refresh_token (or have them re-auth) */
  return googleStrategy
}
