import {Lane, NewLane, UpdatedLane} from './laneSchema';
import {errorObj} from '../utils';
import {GraphQLNonNull, GraphQLInputObjectType, GraphQLBoolean, GraphQLID} from 'graphql';
import r from '../../../database/rethinkdriver';

export default {
  addLane: {
    type: Lane,
    args: {
      lane: {type: new GraphQLNonNull(NewLane)}
    },
    async resolve(source, {lane}, {rootValue}) {
      const {authToken: {id: verifiedId}} = rootValue;
      if (!verifiedId) {
        throw errorObj({_error: 'Unauthorized'});
      }
      lane.createdAt = new Date();
      let newLane;
      try {
        newLane = await r.table('lanes').insert(lane, {returnChanges: true});
      } catch (e) {
        throw errorObj({_error: 'Add lane failed'});
      }
      return newLane.changes[0].new_val;
    }
  },
  updateLane: {
    type: Lane,
    args: {
      lane: {type: new GraphQLNonNull(UpdatedLane)}
    },
    async resolve(source, {lane}, {rootValue}) {
      const {authToken: {id: verifiedId, isAdmin}} = rootValue;
      if (lane.userId !== verifiedId && !isAdmin) {
        throw errorObj({_error: 'Unauthorized'});
      }

      lane.updatedAt = new Date();
      let updatedLane;
      try {
        updatedLane = await r.table('lanes').update(lane, {returnChanges: true});
      } catch (e) {
        throw errorObj({_error: 'Update lane failed'});
      }
      return updatedLane.changes[0].new_val;
    }
  },
  deleteLane: {
    type: GraphQLBoolean,
    args: {
      id: {type: new GraphQLNonNull(GraphQLID)}
    },
    async resolve(source, {id}, {rootValue}) {
      const {authToken: {id: verifiedId, isAdmin}} = rootValue;
      if (lane.userId !== verifiedId && !isAdmin) {
        throw errorObj({_error: 'Unauthorized'});
      }
      try {
        await r.tables('lanes').delete(id);
      } catch(e) {
        throw errorObj({_error: 'Delete lane failed'});
      }
      return true;
    }
  }
};
