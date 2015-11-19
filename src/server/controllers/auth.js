import {loginDB, loginWithIdDB, signupDB} from '../database/models/users';
import jwt from 'jsonwebtoken';
import promisify from 'es6-promisify';
import {jwtSecret} from '../secrets';

const verifyToken = promisify(jwt.verify);

export function login(req, res) {
  const {email, password} = req.body;
  loginDB(email, password)
    .then(user => {
      const token = jwt.sign({id: user.id},jwtSecret, {expiresIn: '7d'});
      res.status(200).json({token, user})
    })
    .catch(error => {
      res.status(401).json({error:error.message})
    })
}

export function loginToken(req, res) {
  const {token} = req.body;
  verifyToken(token, jwtSecret)
    .then(decoded => {
      return loginWithIdDB(decoded.id)
    })
    .then(user => {
      res.status(200).json({user})
    })
    .catch(() => res.sendStatus(401))
}

export function signup(req, res) {
  const {email, password} = req.body;
  signupDB(email, password)
    .then(user => {
      res.status(200)
        .json({token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IlRlc3QgVXNlciJ9.J6n4-v0I85zk9MkxBHroZ9ZPZEES-IKeul9ozxYnoZ8'})
    })
    .catch(err => res.sendStatus(401))
}
