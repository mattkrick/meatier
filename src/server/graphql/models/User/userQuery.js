import r from '../../../database/rethinkdriver';
import {GraphQLString, GraphQLNonNull} from 'graphql';
import {User, UserWithAuthToken} from './userSchema';
import {GraphQLError, locatedError} from 'graphql/error';
import {errorObj} from '../utils';
import {GraphQLEmailType, GraphQLPasswordType} from '../types';
import {getUserByEmail} from './helpers';

export default {
  getUserById: {
    type: User,
    args: {
      id: {type: new GraphQLNonNull(GraphQLString)}
    },
    resolve: (rootValue, args, info) => {
      const {authToken: {id: verifiedId, isAdmin}} = info.rootValue;
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
      let isCorrectPass = await compare(submittedPassword, localPassword);
      if (isCorrectPass) {
        const authToken = jwt.sign({id: user.id}, jwtSecret, {expiresIn: '7d'});
        return {authToken, user};
      } else {
        throw errorObj({_error: 'Login failed', password: 'Incorrect password'});
      }
    }
  }
}

