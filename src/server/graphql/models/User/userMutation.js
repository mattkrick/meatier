import {UserWithAuthToken} from './userSchema';
import {GraphQLEmailType, GraphQLDateType, GraphQLURLType, GraphQLPasswordType} from '../types';
import {errorObj} from '../utils';
import {GraphQLNonNull} from 'graphql';
import r from '../../../database/rethinkdriver';
import {getAltLoginMessage, getSafeUser, makeSecretToken} from '../../../database/models/utils';
import {jwtSecret} from '../../../secrets';
import promisify from 'es6-promisify';
import bcrypt from 'bcrypt';
import uuid from 'node-uuid';
import jwt from 'jsonwebtoken';

const compare = promisify(bcrypt.compare);
const hash = promisify(bcrypt.hash);

export default {
  createUser: {
    type: UserWithAuthToken,
    args: {
      email: {type: new GraphQLNonNull(GraphQLEmailType)},
      password: {type: new GraphQLNonNull(GraphQLPasswordType)}
    },
    async resolve(source, args) {
      const {email, password} = args;
      let user;
      try {
        user = await getUserByEmail(email);
      } catch (e) {
        throw e
      }
      if (user) {
        const {strategies} = user;
        const localPassword = strategies && strategies.local && strategies.local.password;
        if (!localPassword) {
          throw errorObj({_error: getAltLoginMessage(strategies)});
        }
        const isCorrectPass = await compare(password, localPassword);
        if (isCorrectPass) {
          const authToken = jwt.sign({id: user.id}, jwtSecret, {expiresIn: '7d'});
          return {authToken, user};
        } else {
          throw errorObj({_error: 'Cannot create account', email: 'Email already exists'})
        }
      } else {
        //production should use 12+, but it's slow for dev
        const hashedPass = await hash(password, 10);
        const id = uuid.v4();
        //must verify email within 1 day
        const verifiedEmailToken = makeSecretToken(id, 60 * 24);
        const userDoc = {
          id,
          email,
          createdAt: new Date(),
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
          newUser = await r.table('users').insert(userDoc);
        } catch (e) {
          throw errorObj({_error: 'Cannot create new user, please try again'});
        }
        //TODO send email with verifiedEmailToken via mailgun or whatever
        console.log('Verify url:', `http://localhost:3000/auth/verify-email/${verifiedEmailToken}`);
        const authToken = jwt.sign({id: userDoc.id}, jwtSecret, {expiresIn: '7d'});
        return {user: userDoc, authToken};
      }
    }
  }
};
