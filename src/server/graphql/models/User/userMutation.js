import {User, UserWithAuthToken} from './userSchema';
import {GraphQLEmailType, GraphQLURLType, GraphQLPasswordType} from '../types';
import {getUserByEmail, signJwt} from './helpers';
import {errorObj} from '../utils';
import {GraphQLNonNull, GraphQLInputObjectType, GraphQLBoolean} from 'graphql';
import r from '../../../database/rethinkdriver';
import {getAltLoginMessage, makeSecretToken} from './helpers';
import {jwtSecret} from '../../../secrets';
import validateSecretToken from '../../../../universal/utils/validateSecretToken';
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
    async resolve(source, {email, password}) {
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
          const authToken = signJwt({id:user.id});
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
        console.log('Verify url:', `http://localhost:3000/verify-email/${verifiedEmailToken}`);
        const authToken = signJwt({id: userDoc.id});
        return {user: userDoc, authToken};
      }
    }
  },
  emailPasswordReset: {
    type: GraphQLBoolean,
    args: {
      email: {type: new GraphQLNonNull(GraphQLEmailType)}
    },
    async resolve(source, {email}) {
      let user;
      try {
        user = await getUserByEmail(email);
      } catch (e) {
        throw e
      }
      if (!user) {
        throw errorObj({_error: 'User not found'});
      }
      const resetToken = makeSecretToken(user.id, 60 * 24)
      try {
        await r.table('users').get(user.id).update({strategies: {local: {resetToken}}}).run();
      } catch (e) {
        throw errorObj({_error: 'Could not find or update user'});
      }
      console.log('Reset url:', `http://localhost:3000/login/reset-password/${resetToken}`);
      return false;
    }
  },
  resetPassword: {
    type: UserWithAuthToken,
    args: {
      password: {type: new GraphQLNonNull(GraphQLPasswordType)}
    },
    async resolve(source, {password}, {rootValue}) {
      const {resetToken} = rootValue;
      const resetTokenObject = validateSecretToken(resetToken);
      if (resetTokenObject._error) {
        throw errorObj(resetTokenObject);
      }
      let user;
      try {
        user = await r.table('users').get(resetTokenObject.id).run();
      } catch (e) {
        throw errorObj({_error: 'User not found'});
      }
      const userResetToken = user.strategies && user.strategies.local && user.strategies.local.resetToken;
      if (!userResetToken || userResetToken !== resetToken) {
        throw new errorObj({_error: 'Unauthorized'});
      }
      const hashedPass = await hash(password, 10);
      const updates = {
        strategies: {
          local: {
            password: hashedPass,
            resetToken: null
          }
        }
      }
      try {
        user = await r.table('users').get(user.id).update(updates, {returnChanges: true}).run()
      } catch (e) {
        throw errorObj({_error: 'Could not find or update user'});
      }
      user = user.changes[0].new_val;
      const authToken = signJwt(user);
      return {authToken, user};
    }
  },
  resendVerificationEmail: {
    type: User,
    async resolve(source, args, {rootValue}) {
      const {authToken} = rootValue;
      if (!authToken.id) {
        throw errorObj({_error: 'Invalid authentication token'});
      }
      let user;
      try {
        user = await r.table('users').get(id).run();
      } catch (e) {
        throw errorObj({_error: 'User not found'});
      }
      if (user.strategies && user.strategies.local && user.strategies.local.isVerified) {
        throw errorObj({_error: 'Email already verified'});
      }
      const verifiedEmailToken = makeSecretToken(id, 60 * 24);
      try {
        await r.table('users').get(user.id).update({strategies: {local: {verifiedEmailToken}}}).run()
      } catch (e) {
        throw errorObj({_error: 'Could not find or update user'});
      }
      //TODO send email with new verifiedEmailToken via mailgun or whatever
      console.log('Verified url:', `http://localhost:3000/login/verify-email/${verifiedEmailToken}`);
      return user;
    }
  },
  verifyEmail :{
    type: User,
    async resolve(source, args, {rootValue}) {
      const {verifiedEmailToken} = rootValue;
      const verifiedEmailTokenObj = validateSecretToken(verifiedEmailToken);
      if (verifiedEmailTokenObj._error) {
        throw errorObj(verifiedEmailTokenObj);
      }
      let user;
      try {
        user = await r.table('users').get(verifiedEmailTokenObj.id).run();
      } catch (e) {
        throw errorObj({_error: 'User not found'});
      }
      if (user.strategies && user.strategies.local && user.strategies.local.isVerified) {
        throw errorObj({_error: 'Email already verified'});
      }
      if (user.strategies && user.strategies.local && user.strategies.local.verifiedEmailToken !== verifiedEmailToken) {
        throw new errorObj({_error: 'Unauthorized'});
      }
      const updates = {
        strategies: {
          local: {
            isVerified: true,
            verifiedEmailToken: null
          }
        }
      }
      let newUser;
      try {
        newUser = await r.table('users').get(user.id).update(updates, {returnChanges: true}).run();
      } catch (e) {
        throw errorObj({_error: 'Could not find or update user'});
      }
      return newUser.changes[0].new_val;
    }
  },
  loginWithGoogle: {
    type: User,
    arguments: {
      profile: {type: GraphQLInputObjectType, description: 'The profile received from google'}
    },
    async resolve(source, args, {rootValue}) {
      let user
      try {
        user = await getUserByEmail(profile.email);
      } catch (e) {
        throw e
      }
      if (!user) {
        //create new user
        const userDoc = {
          email: profile.email,
          createdAt: new Date(),
          strategies: {
            google: {
              id: profile.id,
              email: profile.email,
              isVerified: profile.verified_email, //we'll assume this is always true
              name: profile.name,
              firstName: profile.given_name,
              lastName: profile.family_name,
              picture: profile.picture,
              gender: profile.gender,
              locale: profile.locale
            }
          }
        }
        let newUser;
        try {
          newUser = await r.table('users').insert(userDoc, {returnChanges: true});
        } catch (e) {
          throw e
        }
        return newUser.changes[0].new_val;
      }
      //if the user already exists && they have a google strategy
      if (user.strategies.google) {
        if (user.strategies.google.id !== profile.id) {
          throw errorObj({_error: 'Unauthorized'});
        }
        return user;
      }
      //if the user already exists && they don't have a google strategy
      throw errorObj(getAltLoginMessage(user.strategies));
    }
  }
};
