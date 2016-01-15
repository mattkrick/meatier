import r from '../../../database/rethinkdriver';
import {GraphQLString, GraphQLNonNull, GraphQLID} from 'graphql';
import {User, UserWithAuthToken} from './userSchema';
import {errorObj} from '../utils';
import {GraphQLEmailType, GraphQLPasswordType} from '../types';
import {getUserByEmail, signJwt} from './helpers';
import {jwtSecret} from '../../../secrets';
import promisify from 'es6-promisify';
import bcrypt from 'bcrypt';

const compare = promisify(bcrypt.compare);
const hash = promisify(bcrypt.hash);

export default {
  getUserById: {
    type: User,
    args: {
      id: {type: new GraphQLNonNull(GraphQLID)}
    },
    resolve: (source, args, {rootValue}) => {
      const {authToken: {id: verifiedId, isAdmin}} = rootValue;
      if (verifiedId !== args.id && !isAdmin) {
        throw errorObj({_error: 'Unauthorized'});
      }
      return r.table('users').get(args.id).run()
    }
  },
  login: {
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
        throw e;
      }
      if (!user) {
        throw errorObj({_error: 'User not found'});
      }
      const {strategies} = user;
      const localPassword = strategies && strategies.local && strategies.local.password;
      if (!localPassword) {
        throw errorObj({_error: getAltLoginMessage(strategies)});
      }
      let isCorrectPass = await compare(password, localPassword);
      if (isCorrectPass) {
        const authToken = signJwt({id: user.id});
        return {authToken, user};
      } else {
        throw errorObj({_error: 'Login failed', password: 'Incorrect password'});
      }
    }
  },
  loginAuthToken: {
    type: User,
    async resolve(source, args, {rootValue}) {
      const {id} = rootValue.authToken;
      if (!id) {
        throw errorObj({_error: 'Invalid authentication Token'});
      }
      let user;
      try {
        user = await r.table('users').get(id).run()
      } catch (e) {
        throw errorObj({_error: 'User not found'});
      }
      return user;
    }
  },
}

