import {loginDB, loginWithIdDB, signupDB, findEmailDB} from '../database/models/users';
import jwt from 'jsonwebtoken';
import promisify from 'es6-promisify';
import {jwtSecret} from '../secrets';
import {authSchemaEmail} from '../../universal/redux/ducks/auth';
import Joi from 'joi';
import {parsedJoiErrors} from '../../universal/utils/utils';

const verifyToken = promisify(jwt.verify);

export async function login(req, res) {
  const {email, password} = req.body;
  let user;
  try {
    user = await loginDB(email, password);
  } catch (e) {
    res.status(401).json({error: e.message});
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
  let user;
  try {
    user = await signupDB(email, password)
  } catch (e) {
    res.status(401).json({error: e.message})
  }
  const token = jwt.sign({id: user.id}, jwtSecret, {expiresIn: '7d'});
  res.status(200).json({token, user})
}

//export async function checkEmail(req, res) {
//  const {email} = req.body;
//  const results = Joi.validate(email, authSchemaEmail, {abortEarly: false});
//  const errors = parsedJoiErrors(results.error);
//  if (errors.email) {
//    return res.status(200).json({isValid: false, error: errors.email});
//  } else {
//    return res.status(200).json({isValid: true, error: null});
//  }
//  //used to see if the email exists in db. since we auto-login from signup screen, this isn't necessary
//  //let users;
//  //try {
//  //  users = await findEmailDB(email);
//  //} catch (error) {
//  //  return res.status(503).json({isValid: true, exists: null, error: error.message});
//  //}
//  //const user = users[0];
//  //if (user) {
//  //  return res.status(200).json({isValid: true, exists: true, error: 'Email already exists in database'});
//  //} else {
//  //  return res.status(200).json({isValid: true, exists: false, error: 'Email not found in database'});
//  //}
//}
