/*
 * The database folder is the only things in the whole app that is DB specific
 * Keeping this modularity is key.
 * By convention, all functions end in DB so you know when a function is touching the DB
 */

import thinky from './thinky';
import promisify from 'es6-promisify';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import {DocumentNotFoundError, AuthenticationError} from '../errors';
import uuid from 'node-uuid';

const compare = promisify(bcrypt.compare);
const hash = promisify(bcrypt.hash);

/*I use Joi for client & server validation, so there's no need for thinky validation
 * Plus, thinky validation has a few quirks that make writing queries awkward
 * I also don't perform joins at the DB level.
 * First, I don't know how efficient joins are in rethinkDB
 * Second, Keeping distinct collections in redux means I don't have to worry
 * about normalizing at the local cache
 * */
export const User = thinky.createModel("users", {});
User.ensureIndex("email");

export async function loginDB(email, submittedPassword) {
  let user
  try {
    user = await getUserByEmail(email);
  } catch (e) {
    throw e
  }
  if (!user) {
    throw new DocumentNotFoundError();
  }
  const userPassword = user.strategies.local && user.strategies.local.password;
  if (!userPassword) {
    throw AuthenticationError()
  }
  let isCorrectPass = await compare(submittedPassword, userPassword);
  if (isCorrectPass) {
    return safeUser(user);
  } else {
    throw new AuthenticationError();
  }
}

export async function getUserByIdDB(id) {
  //be careful, this issues a login without verifying the password (since token already did that)
  let user;
  try {
    user = await User.get(id).pluck(['id', 'email', 'strategies']).run();
  } catch (e) {
    throw e;
  }
  return safeUser(user);
}

export async function signupDB(email, submittedPassword) {
  let user;
  try {
    user = await getUserByEmail(email);
  } catch (e) {
    throw e;
  }
  if (user) {
    const userPassword = user.strategies.local && user.strategies.local.password;
    if (!userPassword) {
      throw AuthenticationError()
    }
    let isCorrectPass = await compare(submittedPassword, userPassword);
    if (isCorrectPass) {
      //treat it like a login
      return [safeUser(user), null]; //null verification token
    } else {
      throw new AuthenticationError();
    }
  } else {
    const hashedPass = await hash(submittedPassword, 10); //production should use 12+, but it's slower
    const id = uuid.v4();
    const verifiedToken = makeSecretToken(id, 60 * 24);
    const userDoc = {
      id,
      email,
      createdAt: Date.now(),
      strategies: {
        local: {
          isVerified: false,
          password: hashedPass,
          verifiedToken
        }
      }
    }
    let newUser;
    try {
      newUser = await User.save(userDoc);
    } catch (e) {
      throw e
    }
    return [safeUser(newUser), verifiedToken];
  }
}

export async function setResetTokenDB(email) {
  let user
  try {
    user = await getUserByEmail(email);
  } catch (e) {
    throw e
  }
  if (!user) {
    throw new DocumentNotFoundError();
  }
  const resetToken = makeSecretToken(user.id, 60 * 24)
  try {
    await User.get(user.id).update({strategies: {local: {resetToken}}}).execute();
  } catch (e) {
    throw e;
  }
  return resetToken;
}

export async function resetPasswordFromTokenDB(id, resetToken, newPassword) {
  let user;
  try {
    user = await User.get(id).pluck('id', 'strategies').run();
  } catch (e) {
    throw e
  }
  if (user.strategies.local.resetToken !== resetToken) {
    throw new AuthenticationError();
  }
  const hashedPass = await hash(newPassword, 10);
  const updates = {
    strategies: {
      local: {
        password: hashedPass,
        resetToken: null
      }
    }
  }
  try {
    await User.get(user.id).update(updates).execute()
  } catch (e) {
    throw e
  }
  return safeUser(user);
}

export async function resetVerifiedTokenDB(id) {
  let user;
  try {
    user = await User.get(id).pluck('id', {strategies: {local: 'isVerified'}}).run();
  } catch (e) {
    throw e
  }
  if (user.strategies.local.isVerified) {
    throw new AuthenticationError('Email already verified');
  }
  const verifiedToken = makeSecretToken(id, 60 * 24);
  try {
    await User.get(user.id).update({strategies: {local: {verifiedToken}}}).save()
  } catch (e) {
    throw e
  }
  return verifiedToken;
}

export async function verifyEmailDB(id, verifiedToken) {
  let user;
  try {
    user = await User.get(id).run();
  } catch (e) {
    throw e
  }
  if (user.strategies.local.isVerified) {
    throw new AuthenticationError('Email already verified');
  }
  if (user.strategies.local.verifiedToken !== verifiedToken) {
    throw new AuthenticationError('Invalid token');
  }
  const updates = {
    strategies: {
      local: {
        isVerified: true,
        verifiedToken: null
      }
    }
  }
  try {
    user = await user.merge(updates).save()
  } catch (e) {
    throw e
  }
  return safeUser(user);
}

async function getUserByEmail(email) {
  let users;
  try {
    users = await User.getAll(email, {index: 'email'}).limit(1).run();
  } catch (e) {
    throw e;
  }
  return users[0];
}

function safeUser(userDoc) {
  return {
    id: userDoc.id,
    email: userDoc.email,
    strategies: {
      local: safeLocalStrategy(userDoc.strategies.local)
      //google: safeGoogleStrategy()
    }
  }
}

function safeLocalStrategy(localStrategy) {
  if (!localStrategy) return {};
  return {
    isVerified: localStrategy.isVerified
  }
}

/*a secret token has the user id, an expiration, and a secret
 the expiration allows for invalidating on the client or server. No need to hit the DB with an expired token
 the user id allows for a quick db lookup in case you don't want to index on email (also eliminates pii)
 the secret keeps out attackers (proxy for rate limiting, IP blocking, still encouraged)
 storing it in the DB means there exists only 1, one-time use key, unlike a JWT, which has many, multi-use keys*/
function makeSecretToken(userId, minutesToExpire) {
  return new Buffer(JSON.stringify({
    id: userId,
    sec: crypto.randomBytes(8).toString('base64'),
    exp: Date.now() + 1000 * 60 * minutesToExpire
  })).toString("base64");
}
