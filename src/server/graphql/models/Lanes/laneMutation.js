import {Lane, NewLane, UpdatedLane} from './laneSchema';
import {errorObj} from '../utils';
import {isLoggedIn} from '../authorization';
import {GraphQLNonNull, GraphQLBoolean, GraphQLID} from 'graphql';
import r from '../../../database/rethinkdriver';

export default {
  addLane: {
    type: Lane,
    args: {
      lane: {type: new GraphQLNonNull(NewLane)}
    },
    async resolve(source, {lane}, {authToken}) {
      isLoggedIn(authToken);
      lane.createdAt = new Date();
      const newLane = await r.table('lanes').insert(lane, {returnChanges: true});
      if (newLane.errors) {
        throw errorObj({_error: 'Could not add lane'});
      }
      return newLane.changes[0].new_val;
    }
  },
  updateLane: {
    type: Lane,
    args: {
      lane: {type: new GraphQLNonNull(UpdatedLane)}
    },
    async resolve(source, {lane}, {authToken}) {
      isLoggedIn(authToken);
      lane.updatedAt = new Date();
      const {id, ...updates} = lane;
      const updatedLane = await r.table('lanes').get(id).update(updates, {returnChanges: true});
      if (updatedLane.errors) {
        throw errorObj({_error: 'Could not update lane'});
      }
      return updatedLane.changes[0].new_val;
    }
  },
  deleteLane: {
    type: GraphQLBoolean,
    args: {
      id: {type: new GraphQLNonNull(GraphQLID)}
    },
    async resolve(source, {id}, {authToken}) {
      isLoggedIn(authToken);
      const {id: verifiedId, isAdmin} = authToken;
      if (!isAdmin) {
        const laneToDelete = await r.table('lanes').get(id);
        if (!laneToDelete) {
          return false;
        }
        if (laneToDelete.userId !== verifiedId) {
          throw errorObj({_error: 'Unauthorized'});
        }
      }
      const result = await r.table('lanes').get(id).delete();
      // return true is delete succeeded, false if doc wasn't found
      return Boolean(result.deleted);
    }
  }
};
