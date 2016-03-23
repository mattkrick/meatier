import {GraphQLObjectType} from 'graphql';
import user from './models/User/userMutation';
import lane from './models/Lanes/laneMutation';
import note from './models/Notes/noteMutation';

const rootFields = Object.assign(user, lane, note);

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: () => rootFields
});
