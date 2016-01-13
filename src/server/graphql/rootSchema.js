import query from './rootQuery';
import mutation from './rootMutation';
import {GraphQLSchema} from 'graphql';
export default new GraphQLSchema({query, mutation});
