import thinky from './thinky';
import promisify from 'es6-promisify';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import {DocumentNotFoundError, AuthorizationError} from '../errors';
import uuid from 'node-uuid';

const compare = promisify(bcrypt.compare);
const hash = promisify(bcrypt.hash);

const User = thinky.createModel("users", {});
User.ensureIndex("email");

export async function loginDB(email, password) {
  let user
  try {
    user = await getUserByEmail(email);
  } catch (e) {
    throw e
  }
  if (!user) {
    throw new DocumentNotFoundError();
  }

  let isCorrectPass = await compare(password, user.password);
  if (isCorrectPass) {
    return safeUser(user);
  } else {
    throw new AuthorizationError();
  }
}

export async function getUserByIdDB(id) {
  //be careful, this issues a login without verifying the password (since token already did that)
  let user;
  try {
    user = await User.get(id).pluck(['id', 'email', 'isVerified']).run();
  } catch (e) {
    throw e;
  }
  return safeUser(user);
}

export async function signupDB(email, password) {
  let user;
  try {
    user = await getUserByEmail(email);
  } catch (e) {
    throw e;
  }
  if (user) {
    let isCorrectPass = await compare(password, user.password);
    if (isCorrectPass) {
      //treat it like a login
      return safeUser(user);
    } else {
      throw new AuthorizationError();
    }
  } else {
    const hashedPass = await hash(password, 10); //production should use 12+, but it's slower
    const id = uuid.v4();
    const userDoc = {
      id,
      email,
      password: hashedPass,
      createdAt: Date.now(),
      isVerified: false,
      verifiedToken: makeSecretToken(id, 60 * 24)
    }
    let newUser;
    try {
      newUser = await User.save(userDoc);
    } catch (e) {
      throw e
    }
    return [safeUser(newUser), userDoc.verifiedToken];
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
    await user.merge({resetToken}).save()
  } catch (e) {
    throw e;
  }
  return resetToken;
}

export async function resetPasswordFromTokenDB(id, resetToken, newPassword) {
  let user;
  try {
    user = await User.get(id).pluck(['id','resetToken']).run();
  } catch (e) {
    throw e
  }
  if (user.resetToken !== resetToken) {
    throw new AuthorizationError();
  }
  const hashedPass = await hash(newPassword, 10);
  const updates = {
    password: hashedPass,
    resetToken: null
  }
  try {
    user = await user.merge(updates).save()
  } catch (e) {
    throw e
  }
  return safeUser(user);
}

export async function resetVerifiedTokenDB(id) {
  let user;
  try {
    user = await User.get(id).pluck(['id','verifiedToken', 'isVerified']).run();
  } catch (e) {
    throw e
  }
  if (user.isVerified) {
    throw new AuthorizationError('User already verified');
  }
  const updates = {verifiedToken: makeSecretToken(id, 60 * 24)};
  try {
    await user.merge(updates).save()
  } catch (e) {
    throw e
  }
  return updates.verifiedToken;
}

export async function verifyEmailDB(id, verifiedToken) {
  let user;
  try {
    user = await User.get(id).pluck(['id','verifiedToken', 'isVerified']).run();
  } catch (e) {
    throw e
  }
  if (user.isVerified) {
    throw new AuthorizationError('Email already verified');
  }
  if (user.verifiedToken !== verifiedToken) {
    throw new AuthorizationError('Invalid token');
  }
  const updates = {
    isVerified: true,
    verifiedToken: null
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

function safeUser({id, email, isVerified}) {
  return {id, email, isVerified}
}

function makeSecretToken(userId, minutesToExpire) {
  //a secret token has the user id, an expiration, and a secret
  //the expiration allows for invalidating on the client or server. No need to hit the DB with an expired token
  //the user id allows for a quick db lookup
  //the secret keeps out attackers (proxy for rate limiting, IP blocking, still encouraged)
  //storing it in the DB means there exists only 1, one-time use key, unlike a JWT, which has many, multi-use keys
  return new Buffer(JSON.stringify({
    id: userId,
    sec: crypto.randomBytes(8).toString('base64'),
    exp: Date.now() + 1000 * 60 * minutesToExpire
  })).toString("base64");
}
