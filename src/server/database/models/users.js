import thinky from './_utils';
import bcrypt from 'bcrypt';
import promisify from 'es6-promisify';
import Joi from 'joi';
//import {authSchema} from '../../../universal/redux/ducks/auth';
//import {parsedJoiErrors} from '../../../universal/utils/utils'
//
//
////return parsedJoiErrors(results.error);
//
const compare = promisify(bcrypt.compare);
const hash = promisify(bcrypt.hash);

const {type, r} = thinky;

const User = thinky.createModel("users", {
  id: type.string(),
  name: type.string(),
  email: type.string().email().required(),
  isVerified: type.boolean().default(false),
  password: type.string().required(),
  createdAt: type.date().default(r.now())
}, {
  enforce_extra: 'strict'
});
User.ensureIndex("email");


export async function loginDB(email, password) {
  let users;
  try {
    users = await findEmailDB(email);
  } catch(error) {
    throw new Error('Error reaching database, please try again');
  }
  const user = users[0];
  if (!user) {
    console.log('incorrect email');
    throw new Error('Incorrect email');
  }
  let isCorrectPass = await compare(password, user.password);
  if (isCorrectPass) {
    delete user.password;
    delete user.createdAt;
    return user;
  } else {
    throw new Error('Incorrect password');
  }
}

export async function loginWithIdDB(id) {
  //be careful, this issues a login without verifying the password (since token already did that)
  let user;
  try {
    user = await User.get(id).run();
  } catch (error) {
    throw new Error('Error reaching database, please try again');
  }
  delete user.password;
  delete user.createdAt;
  return user;
}

export async function signupDB(email, password) {
  let users;
  try {
    users = await findEmailDB(email);
  } catch (error) {
    throw new Error('Error reaching database, please try again');
  }
  const user = users[0];
  if (user) {
    let isCorrectPass = await compare(password, user.password);
    if (isCorrectPass) {
      //log the fool in anyways
      delete user.password;
      delete user.createdAt;
      return user;
    } else {
      throw new Error('Email already exists in database');
    }
  } else {
    const hashedPass = await hash(password, 10); //production should use 12+
    let newUser;
    try {
      newUser = await User.save({email, password: hashedPass});
    } catch (error) {
      throw new Error(error);
    }
    return newUser;
  }
}

export function findEmailDB(email) {
  return User.getAll(email, {index: 'email'}).limit(1).run();
}
