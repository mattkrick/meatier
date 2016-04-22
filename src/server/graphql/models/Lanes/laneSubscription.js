import r from '../../../database/rethinkdriver';
import {isLoggedIn} from '../authorization';
import {getFields} from '../utils';
import {Lane} from './laneSchema';

export default {
  getAllLanes: {
    type: Lane,
    async resolve(source, args, {authToken, socket}, refs) {
      const {fieldName} = refs;
      const requestedFields = Object.keys(getFields(refs));
      isLoggedIn(authToken);
      r.table('lanes')
        .filter(r.row('isPrivate').eq(false).or(r.row('userId').eq(authToken.id)))
        .pluck(requestedFields)
        .changes({includeInitial: true})
        .run({cursor: true}, (err, cursor) => {
          if (err) {
            throw err;
          }
          cursor.each((err, data) => {
            if (err) {
              throw err;
            }
            const docId = data.new_val ? data.new_val.id : data.old_val.id;
            if (socket.docQueue.has(docId)) {
              socket.docQueue.delete(docId);
            } else {
              socket.emit(fieldName, data);
            }
          });
          socket.on('unsubscribe', channelName => {
            if (channelName === fieldName) {
              cursor.close();
            }
          });
        });
    }
  }
};

