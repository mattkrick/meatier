//import crypto from 'crypto';
//import {User} from './localStrategy';
//
//export async function getUserByEmail(email) {
//  let users;
//  try {
//    users = await User.getAll(email, {index: 'email'}).limit(1).run();
//  } catch (e) {
//    throw e;
//  }
//  return users[0];
//}
//
//export function getSafeUser(userDoc) {
//  const {id, email, strategies} = userDoc;
//  return {
//    id,
//    email,
//    strategies: getSafeStrategies(strategies)
//  }
//}
//
//function getSafeStrategies(strategies) {
//  const safeStrategies = {};
//  const {local, google} = strategies;
//  if (local) safeStrategies.local = safeLocalStrategy(local)
//  if (google) safeStrategies.google = safeGoogleStrategy(google)
//  return safeStrategies;
//}
//
//function safeLocalStrategy(localStrategy) {
//  return {
//    isVerified: localStrategy.isVerified
//  }
//}
//
//function safeGoogleStrategy(googleStrategy) {
//  /*  As is, we can share everything with the client
//   We don't store a refresh_token because those don't expire so storing them opens us up to attacks
//   we don't store an access_token because they expire in 1 hour
//   we don't store an id_token because they expire in 1 hour (and we issue our own, 7 day token)
//   if we needed authorization (eg facebook friends list) we could grab it immediately & store it in the DB
//   if we needed authorization that updates before token expiration,
//   we'd store the id_token in localStorage & refresh it from an in-memory refresh_token (or have them re-auth) */
//  return googleStrategy
//}
