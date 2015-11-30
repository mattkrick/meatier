import thinky from './thinky';
import promisify from 'es6-promisify';
import bcrypt from 'bcrypt';
import {DocumentNotFoundError, AuthorizationError} from '../errors';


const compare = promisify(bcrypt.compare);
const hash = promisify(bcrypt.hash);

const User = thinky.createModel("users", {});
User.ensureIndex("email");

export async function loginDB(email, password) {
  let users;

  try {
    users = await findEmailDB(email);
  } catch(e) {
    throw e;
  }
  const user = users[0];
  if (!user) {
    throw new DocumentNotFoundError();
  }
  let isCorrectPass = await compare(password, user.password);
  if (isCorrectPass) {
    delete user.password;
    delete user.createdAt;
    return user;
  } else {
    throw new AuthorizationError();
  }
}

export async function loginWithIdDB(id) {
  //be careful, this issues a login without verifying the password (since token already did that)
  let user;
  try {
    user = await User.get(id).run();
  } catch (e) {
    throw e;
  }
  delete user.password;
  delete user.createdAt;
  return user;
}

export async function signupDB(email, password) {
  let users;
  try {
    users = await findEmailDB(email);
  } catch (e) {
    throw e;
  }
  const user = users[0];
  if (user) {
    let isCorrectPass = await compare(password, user.password);
    if (isCorrectPass) {
      //treat it like a login
      delete user.password;
      delete user.createdAt;
      return user;
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
    return newUser;
  }
}

export function findEmailDB(email) {
  return User.getAll(email, {index: 'email'}).limit(1).run();
}
