import user from './models/User/userQuery';
import {GraphQLObjectType} from 'graphql';

const rootFields = Object.assign({}, user);
export default new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => rootFields
});
