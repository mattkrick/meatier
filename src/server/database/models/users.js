import thinky from './thinky';
import promisify from 'es6-promisify';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import {DocumentNotFoundError, AuthorizationError} from '../errors';


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
    user = await User.get(id).without(['password', 'createdAt', 'resetToken']).run();
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
    let newUser;
    try {
      newUser = await User.save({email, password: hashedPass, createdAt: Date.now(), isVerified: false});
    } catch (e) {
      throw e
    }
    return safeUser(newUser);
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
  //a reset token has the user id, an expiration, and a secret
  //this way, even if an attacked knew the millisecond the request was issued, they still couldn't counterfeit a key
  //it also means we can check the expiration on the client, so it's very cheap
  //finally, since we know the userId, we don't have to traverse the entire user collection (like what Meteor does)
  const resetToken = new Buffer(JSON.stringify({
    id: user.id,
    sec: crypto.randomBytes(16).toString('base64'),
    exp: Date.now() + 1000 * 60 * 60 * 24 //1 day
  })).toString("base64");
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
    user = await User.get(id).without(['createdAt']).run();
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
