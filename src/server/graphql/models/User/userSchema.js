import {GraphQLBoolean, GraphQLString, GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLInputObjectType} from 'graphql';
import {GraphQLEmailType, GraphQLURLType} from '../types';
import {resolveForAdmin} from '../utils';

const GoogleStrategy = new GraphQLObjectType({
  /*  As is, we can share everything with the client
   We don't store a refresh_token because those don't expire so storing them opens us up to attacks
   we don't store an access_token because they expire in 1 hour
   we don't store an id_token because they expire in 1 hour (and we issue our own, 7 day token)
   if we needed authorization (eg facebook friends list) we could grab it immediately & store it in the DB
   if we needed authorization that updates before token expiration,
   we'd store the id_token in localStorage & refresh it from an in-memory refresh_token (or have them re-auth) */
  name: 'GoogleStrategy',
  description: 'The google strategy for a user account',
  fields: () => ({
    id: {type: GraphQLID, description: 'Google userId'},
    email: {type: GraphQLEmailType, description: 'Email registered with google'},
    isVerified: {type: GraphQLBoolean, description: 'Google email state of email verification'},
    name: {type: GraphQLString, description: 'Name associated with Google account'},
    firstName: {type: GraphQLString, description: 'First name associated with Google account'},
    lastName: {type: GraphQLString, description: 'Last name associated with Google account'},
    picture: {type: GraphQLURLType, description: 'url of google account profile picture'},
    gender: {type: GraphQLString, description: 'gender of google user'},
    locale: {type: GraphQLString, description: 'locale of user to help determine language'}
  })
});

const LocalStrategy = new GraphQLObjectType({
  name: 'LocalStrategy',
  description: 'The local (username, password) strategy for a user account',
  fields: () => ({
    isVerified: {type: GraphQLBoolean, description: 'Account state of email verification'},
    password: {
      type: GraphQLString,
      description: 'Hashed password',
      resolve: () => null
    },
    verifiedEmailToken: {
      type: GraphQLString,
      description: 'The token sent to the user\'s email for verification',
      resolve: (source, args, {authToken}) => resolveForAdmin(source, args, authToken)
    },
    resetToken: {
      type: GraphQLString,
      description: 'The token used to reset the user\'s password',
      resolve: (source, args, {authToken}) => resolveForAdmin(source, args, authToken)
    }
  })
});

const UserStrategies = new GraphQLObjectType({
  name: 'UserStrategies',
  fields: () => ({
    local: {type: LocalStrategy, description: 'The local authentication strategy'},
    google: {type: GoogleStrategy, description: 'The google authentication strategy'}
  })
});

export const User = new GraphQLObjectType({
  name: 'User',
  description: 'The user account',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLID), description: 'The userId'},
    email: {type: new GraphQLNonNull(GraphQLEmailType), description: 'The user email'},
    createdAt: {type: GraphQLString, description: 'The datetime the user was created'},
    updatedAt: {type: GraphQLString, description: 'The datetime the user was last updated'},
    strategies: {type: UserStrategies, description: 'The login strategies used by the user'}
  })
});

export const UserWithAuthToken = new GraphQLObjectType({
  name: 'UserWithAuthToken',
  description: 'The user account with an optional auth token',
  fields: () => ({
    user: {type: User, description: 'The user account'},
    authToken: {type: GraphQLString, description: 'The auth token to allow for quick login'}
  })
});

/* eslint-disable camelcase*/
export const GoogleProfile = new GraphQLInputObjectType({
  name: 'GoogleProfile',
  description: 'The profile received from the google oauth2 callback',
  fields: () => ({
    id: {type: GraphQLID, description: 'Google userId'},
    email: {type: GraphQLEmailType, description: 'Email registered with google'},
    verified_email: {type: GraphQLBoolean, description: 'Google email state of email verification'},
    name: {type: GraphQLString, description: 'Name associated with Google account'},
    given_name: {type: GraphQLString, description: 'First name associated with Google account'},
    family_name: {type: GraphQLString, description: 'Last name associated with Google account'},
    link: {type: GraphQLURLType, description: 'Google+ Account url'},
    picture: {type: GraphQLURLType, description: 'url of google account profile picture'},
    gender: {type: GraphQLString, description: 'gender of google user'},
    locale: {type: GraphQLString, description: 'locale of user to help determine language'}
  })
});
/* eslint-enable camelcase*/
