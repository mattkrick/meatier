/*
 * The database folder is the only things in the whole app that is DB specific
 * Keeping this modularity is key.
 * By convention, all functions end in 'DB' so you know when a function is touching the DB
 */
import thinky from './thinky';
import promisify from 'es6-promisify';
import bcrypt from 'bcrypt';
import {DocumentNotFoundError, AuthenticationError, DuplicateFoundError} from '../errors';
import uuid from 'node-uuid';
import jwt from 'jsonwebtoken';
import {makeSecretToken, getUserByEmail, getSafeUser, getAltLoginMessage} from './utils';
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

export async function signupDB(email, submittedPassword) {
  let user;
  try {
    user = await getUserByEmail(email);
  } catch (e) {
    throw new DocumentNotFoundError('User not found');
  }
  if (user) {
    const {strategies} = user;
    const userPassword = strategies.local && strategies.local.password;
    if (!userPassword) {
      throw new DuplicateFoundError(getAltLoginMessage(strategies));
    }
    let isCorrectPass = await compare(submittedPassword, userPassword);
    if (isCorrectPass) {
      //treat it like a login
      return [getSafeUser(user), null]; //null verification token
    } else {
      throw new AuthenticationError();
    }
  } else {
    const hashedPass = await hash(submittedPassword, 10); //production should use 12+, but it's slower
    const id = uuid.v4();
    const verifiedEmailToken = makeSecretToken(id, 60 * 24);
    const userDoc = {
      id,
      email,
      createdAt: Date.now(),
      strategies: {
        local: {
          isVerified: false,
          password: hashedPass,
          verifiedEmailToken
        }
      }
    }
    let newUser;
    try {
      newUser = await User.save(userDoc);
    } catch (e) {
      throw e
    }
    return [getSafeUser(newUser), verifiedEmailToken];
  }
}

export async function loginDB(email, submittedPassword) {
  let user
  try {
    user = await getUserByEmail(email);
  } catch (e) {
    throw e
  }
  if (!user) {
    throw new DocumentNotFoundError('User not found');
  }
  const {strategies} = user;
  const userPassword = strategies.local && strategies.local.password;
  if (!userPassword) {
    const errMessage = getAltLoginMessage(strategies);
    throw new DuplicateFoundError(errMessage);
  }
  let isCorrectPass = await compare(submittedPassword, userPassword);
  if (isCorrectPass) {
    return getSafeUser(user);
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
    throw new DocumentNotFoundError('User not found');
  }
  return getSafeUser(user);
}

export async function setResetTokenDB(email) {
  let user
  try {
    user = await getUserByEmail(email);
  } catch (e) {
    throw e
  }
  if (!user) {
    throw new DocumentNotFoundError('User not found');
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
    user = await User.get(id).pluck('id', 'email', 'strategies').run();
  } catch (e) {
    throw new DocumentNotFoundError('User not found');
  }
  const userResetToken = user.strategies.local && user.strategies.local.resetToken;
  if (!userResetToken || userResetToken !== resetToken) {
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
  return getSafeUser(user);
}

export async function resetVerifiedTokenDB(id) {
  let user;
  try {
    user = await User.get(id).pluck('id', {strategies: {local: 'isVerified'}}).run();
  } catch (e) {
    throw new DocumentNotFoundError('User not found');
  }
  if (user.strategies.local.isVerified) {
    throw new AuthenticationError('Email already verified');
  }
  const verifiedEmailToken = makeSecretToken(id, 60 * 24);
  try {
    await User.get(user.id).update({strategies: {local: {verifiedEmailToken}}}).execute()
  } catch (e) {
    throw e
  }
  return verifiedEmailToken;
}

export async function verifyEmailDB(id, verifiedEmailToken) {
  let user;
  try {
    user = await User.get(id).run();
  } catch (e) {
    throw new DocumentNotFoundError('User not found');
  }
  if (user.strategies.local.isVerified) {
    throw new AuthenticationError('Email already verified');
  }
  if (user.strategies.local.verifiedEmailToken !== verifiedEmailToken) {
    throw new AuthenticationError('Invalid verification token');
  }
  const updates = {
    strategies: {
      local: {
        isVerified: true,
        verifiedEmailToken: null
      }
    }
  }
  try {
    user = await user.merge(updates).save()
  } catch (e) {
    throw e
  }
  return getSafeUser(user);
}
