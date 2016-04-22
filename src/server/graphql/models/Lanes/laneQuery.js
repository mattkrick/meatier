import r from '../../../database/rethinkdriver';
import {GraphQLNonNull, GraphQLID} from 'graphql';
import {Lane} from './laneSchema';
import {errorObj} from '../utils';
import {isLoggedIn} from '../authorization';

export default {
  getLaneById: {
    type: Lane,
    args: {
      id: {type: new GraphQLNonNull(GraphQLID)}
    },
    async resolve(source, {id}, {authToken}) {
      isLoggedIn(authToken);
      const {id: verifiedId, isAdmin} = authToken;
      const lane = await r.table('lanes').get(id);
      if (!lane) {
        throw errorObj({_error: 'Lane not found'});
      }
      if (lane.isPrivate && lane.userId !== verifiedId && !isAdmin) {
        throw errorObj({_error: 'Unauthorized'});
      }
      return lane;
    }
  }
};

