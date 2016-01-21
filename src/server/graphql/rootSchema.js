import query from './rootQuery';
import mutation from './rootMutation';
import subscription from './rootSubscription';
import {GraphQLSchema} from 'graphql';
export default new GraphQLSchema({query, mutation, subscription});
