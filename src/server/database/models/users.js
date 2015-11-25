import thinky from './thinky';
import promisify from 'es6-promisify';
import bcrypt from 'bcrypt';

const compare = promisify(bcrypt.compare);
const hash = promisify(bcrypt.hash);

const {type, r} = thinky;

const User = thinky.createModel("users", {});
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
    throw new Error('email');
  }
  let isCorrectPass = await compare(password, user.password);
  if (isCorrectPass) {
    delete user.password;
    delete user.createdAt;
    return user;
  } else {
    throw new Error('password');
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
      //treat it like a login
      delete user.password;
      delete user.createdAt;
      return user;
    } else {
      throw new Error('email');
    }
  } else {
    const hashedPass = await hash(password, 10); //production should use 12+
    let newUser;
    try {
      newUser = await User.save({email, password: hashedPass, createdAt: Date.now(), isVerified: false});
    } catch (error) {
      throw new Error(error);
    }
    return newUser;
  }
}

export function findEmailDB(email) {
  return User.getAll(email, {index: 'email'}).limit(1).run();
}
