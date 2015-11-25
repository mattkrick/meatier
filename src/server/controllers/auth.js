import {loginDB, loginWithIdDB, signupDB, findEmailDB} from '../database/models/users';
import jwt from 'jsonwebtoken';
import promisify from 'es6-promisify';
import {jwtSecret} from '../secrets';
import {authSchema} from '../../universal/redux/ducks/auth';
import Joi from 'joi';
import {parsedJoiErrors} from '../../universal/utils/schema';

const verifyToken = promisify(jwt.verify);

export async function login(req, res) {
  const {email, password} = req.body;
  const schemaError = validateAuthSchema(req.body);
  if (schemaError) {
    res.status(401).json({error: schemaError});
  }
  let user;
  try {
    user = await loginDB(email, password);
  } catch (e) {
    let error;
    if (e.message === 'email') {
      error = {
        _error: 'Login failed',
        email: 'Email not found'
      }
    } else if (e.message === 'password') {
      error = {
        _error: 'Login failed',
        password: 'Incorrect password' //todo 3 attempts left!
      }
    } else {
      error = {
        _error: e.message
      }
    }
    res.status(401).json({error});
  }
  const token = jwt.sign({id: user.id}, jwtSecret, {expiresIn: '7d'}); //sync
  res.status(200).json({token, user})
}

export async function loginToken(req, res) {
  const {token} = req.body;
  let decoded, user;
  try {
    decoded = await verifyToken(token, jwtSecret);
  } catch (e) {
    res.sendStatus(401).json({error: 'Invalid token'})
  }
  try {
    user = await loginWithIdDB(decoded.id);
  } catch (e) {
    res.sendStatus(401).json({error: e.message})
  }
  res.status(200).json({user})
}

export async function signup(req, res) {
  const {email, password} = req.body;
  const schemaError = validateAuthSchema(req.body);
  if (schemaError) {
    res.status(401).json({error: schemaError});
  }
  let user;
  try {
    user = await signupDB(email, password);
  } catch (e) {
    let error;
    if (e.message === 'email') {
      error = {
        _error: 'Cannot create account',
        email: 'Email already exists'
      }
    } else {
      error = {
        _error: e.message
      }
    }
    res.status(401).json({error})
  }
  const token = jwt.sign({id: user.id}, jwtSecret, {expiresIn: '7d'});
  res.status(200).json({token, user})
}


function validateAuthSchema(credentials) {
  const results = Joi.validate(credentials, authSchema, {abortEarly: false});
  const error = parsedJoiErrors(results.error);
  if (Object.keys(error).length) {
    error._error = 'Invalid credentials';
    return error;
  }
}
//used to see if the email exists in db. since we auto-login from signup screen, this isn't necessary
//let users;
//try {
//  users = await findEmailDB(email);
//} catch (error) {
//  return res.status(503).json({isValid: true, exists: null, error: error.message});
//}
//const user = users[0];
//if (user) {
//  return res.status(200).json({isValid: true, exists: true, error: 'Email already exists in database'});
//} else {
//  return res.status(200).json({isValid: true, exists: false, error: 'Email not found in database'});
//}
//}
//
