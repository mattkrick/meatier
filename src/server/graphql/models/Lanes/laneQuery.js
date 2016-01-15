import r from '../../../database/rethinkdriver';
import {GraphQLString, GraphQLNonNull, GraphQLID} from 'graphql';
import {Lane} from './laneSchema';
import {errorObj} from '../utils';

export default {
  getLaneById: {
    type: Lane,
    args: {
      id: {type: new GraphQLNonNull(GraphQLID)}
    },
     resolve: async (source, {id}, {rootValue}) => {
      const {authToken: {id: verifiedId, isAdmin}} = rootValue;
       if (!verifiedId) {
         throw errorObj({_error: 'Unauthorized'});
       }
      let lane;
      try {
        lane = await r.table('lanes').get(id).run()
      } catch(e) {
        throw e;
      }
       if (lane.isPrivate && (lane.userId !== verifiedId || !isAdmin)) {
         throw errorObj({_error: 'Unauthorized'});
       }
       return lane;
    }
  }
}

