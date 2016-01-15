import user from './models/User/userMutation';
import lane from './models/Lanes/laneMutation';

import {GraphQLObjectType} from 'graphql';

const rootFields = Object.assign({}, user, lane);
export default new GraphQLObjectType({
  name: 'Mutation',
  fields: () => rootFields
});




