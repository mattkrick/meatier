import {Lane, LaneInput} from './laneSchema';
import {errorObj} from '../utils';
import {GraphQLNonNull, GraphQLInputObjectType, GraphQLBoolean} from 'graphql';
import r from '../../../database/rethinkdriver';

export default {
  addLane: {
    type: Lane,
    args: {
      lane: {type: new GraphQLNonNull(LaneInput)}
    },
    async resolve(source, {lane}) {
      lane.createdAt = new Date();
      let newLane;
      try {
        newLane = await r.table('lanes').insert(lane, {returnChanges: true});
      } catch (e) {
        throw errorObj({_error: 'Add lane failed'});
      }
      return newLane.changes[0].new_val;
    }
  }
};
