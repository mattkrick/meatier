/*
 * Controllers are the link between the server and the database.
 * They never touch the database, they just handle DB errors so swapping out DBs is easy
 * Just make sure your DB handlers throw the same errors
 */
import {loginDB, getUserByIdDB, signupDB, setResetTokenDB, resetPasswordFromTokenDB, resetVerifiedTokenDB, verifyEmailDB} from '../database/models/users';
import jwt from 'jsonwebtoken';
import promisify from 'es6-promisify';
import {jwtSecret} from '../secrets';
import {authSchemaInsert, authSchemaEmail, authSchemaPassword} from '../../universal/redux/ducks/auth';
import validateSecretToken from '../../universal/utils/validateSecretToken';
import Joi from 'joi';
import {parsedJoiErrors} from '../../universal/utils/schema';

const verifyToken = promisify(jwt.verify);

export async function login(req, res) {
  const {email, password} = req.body;
  const schemaError = validateAuthSchema(req.body, authSchemaInsert);
  if (schemaError) {
    return res.status(401).json({error: schemaError});
  }
  let user;
  try {
    user = await loginDB(email, password);
  } catch (e) {
    let error = {_error: 'Login failed'};
    if (e.name === 'DocumentNotFoundError') {
      error.email = 'Email not found';
    } else if (e.name === 'AuthenticationError') {
      error.password = 'Incorrect password' //todo 3 attempts left!
    } else {
      error._error = e.message;
    }
    return res.status(401).json({error});
  }
  const token = signJwt(user);
  res.status(200).json({token, user})
}

export async function loginToken(req, res) {
  const {token} = req.body;
  let decoded, user;
  try {
    decoded = await verifyToken(token, jwtSecret);
  } catch (e) {
    return res.status(401).json({error: 'Invalid token'})
  }
  try {
    user = await getUserByIdDB(decoded.id);
  } catch (e) {
    return res.status(401).json({error: e.message})
  }
  res.status(200).json({user})
}

export async function signup(req, res) {
  const {email, password} = req.body;
  const schemaError = validateAuthSchema(req.body, authSchemaInsert);
  if (schemaError) {
    return res.status(401).json({error: schemaError});
  }
  let user, verifiedToken;
  try {
    [user, verifiedToken] = await signupDB(email, password);
  } catch (e) {
    let error = {_error: 'Cannot create account'};
    if (e.name === 'AuthenticationError') {
        error.email = 'Email already exists';
    } else {
      error._error = e.message;
    }
    return res.status(401).json({error})
  }
  //verifiedToken is null if we found out it's actually a login)
  if (verifiedToken) {
    //TODO send email with verifiedEmailToken via mailgun or whatever
    console.log('Verify url:', `http://localhost:3000/login/verify-email/${verifiedToken}`);
  }

  const token = jwt.sign({id: user.id}, jwtSecret, {expiresIn: '7d'});
  res.status(200).json({token, user})
}

export async function sendResetEmail(req, res) {
  const {email} = req.body;
  const schemaError = validateAuthSchema(req.body, authSchemaEmail);
  if (schemaError) {
    return res.status(401).json({error: schemaError});
  }
  let resetToken;
  try {
    resetToken = await setResetTokenDB(email);
  } catch (e) {
    let error = {_error: 'Reset failed'};
    if (e.name === 'DocumentNotFoundError') {
        error.email = 'Email not found';
    } else {
      error._error = e.message;
    }
    return res.status(401).json({error});
  }
  //TODO send email with resetToken via mailgun or whatever
  console.log('Reset url:', `http://localhost:3000/login/reset-password/${resetToken}`);
  res.sendStatus(200);
}

export async function resetPassword(req, res) {
  const {resetToken, password} = req.body;
  const schemaError = validateAuthSchema({password}, authSchemaPassword);
  if (schemaError) {
    return res.status(401).json({error: schemaError});
  }
  const resetTokenObject = validateSecretToken(resetToken);
  if (resetTokenObject.error) {
    return res.status(401).json({error: resetTokenObject.error});
  }
  let user;
  try {
    user = await resetPasswordFromTokenDB(resetTokenObject.id, resetToken, password);
  } catch (e) {
    let error;
    if (e.name === 'DocumentNotFoundError') {
      error = {_error: 'User not found'};
    } else if (e.name === 'AuthenticationError') {
      error = {_error: 'Invalid token'};
    } else {
      error = {_error: e.message};
    }
    return res.status(401).json({error});
  }
  const token = signJwt(user);
  res.status(200).json({token, user})
}

export async function resendVerifiedEmail(req, res) {
  const {token} = req.body;
  let decoded;
  try {
    decoded = await verifyToken(token, jwtSecret);
  } catch (e) {
    return res.status(401).json({error: 'Invalid token'})
  }
  let verifiedToken;
  try {
    verifiedToken = await resetVerifiedTokenDB(decoded.id);
  } catch (e) {
    return res.status(401).json({error: e.message})
  }
  //TODO send email with new verifiedToken via mailgun or whatever
  console.log('Verified url:', `http://localhost:3000/login/verify-email/${verifiedToken}`);
  res.sendStatus(200);
}

export async function verifyEmail(req, res) {
  const {verifiedToken} = req.body;
  const verifiedTokenObject = validateSecretToken(verifiedToken);
  if (verifiedTokenObject.error) {
    return res.status(401).json({error: verifiedTokenObject.error});
  }
  try {
    await verifyEmailDB(verifiedTokenObject.id, verifiedToken);
  } catch (e) {
    let error;
    if (e.name === 'DocumentNotFoundError') {
      error = {_error: 'User not found'};
    } else {
      error = {_error: e.message};
    }
    return res.status(401).json({error});
  }
  res.sendStatus(200);
}

function validateAuthSchema(credentials, schema) {
  //Failing here means they passed the client validation, so they're probably up to no good
  const results = Joi.validate(credentials, schema, {abortEarly: false});
  const error = parsedJoiErrors(results.error);
  if (Object.keys(error).length) {
    error._error = 'Invalid credentials';
    return error;
  }
}

function signJwt(user) {
  return jwt.sign({id: user.id}, jwtSecret, {expiresIn: '7d'}); //sync
}
