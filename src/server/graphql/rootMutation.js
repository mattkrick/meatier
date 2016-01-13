import user from './models/User/userMutation';
import {GraphQLObjectType} from 'graphql';

const rootFields = Object.assign({}, user);
export default new GraphQLObjectType({
  name: 'Mutation',
  fields: () => rootFields
});




