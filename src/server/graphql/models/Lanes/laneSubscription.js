import r from '../../../database/rethinkdriver';
import {GraphQLBoolean} from 'graphql';
import {isLoggedIn} from '../authorization';
import {getFields} from '../utils';
import {Lane} from './laneSchema';


export default {
  getAllLanes: {
    type: Lane,
    async resolve (source, args, refs) {
      const {rootValue, fieldName} = refs;
      const {socket, authToken} = rootValue;
      const requestedFields = Object.keys(getFields(refs));
      isLoggedIn(rootValue);
      r.table('lanes')
        .filter(r.row('isPrivate').eq(false).or(r.row('userId').eq(authToken.id)))
        .pluck(requestedFields)
        .changes({includeInitial: true})
        .run({cursor: true}, (err, cursor) => {
          if (err) throw err;
          cursor.each((err, data) => {
            if (err) throw err;
            const docId = data.new_val ? data.new_val.id : data.old_val.id;
            socket.docQueue.has(docId) ? socket.docQueue.delete(docId) : socket.emit(fieldName, data);
          });
          socket.on('unsubscribe', channelName => {
            if (channelName === fieldName) {
              cursor && cursor.close();
            }
          })
        });
    }
  }
}

