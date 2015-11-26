import {BEGIN, COMMIT, REVERT} from 'redux-optimist';
import socketCluster from 'socketcluster-client';
import socketOptions from '../../utils/socketOptions';

const _SUCCESS = '_SUCCESS';
const _ERROR = '_ERROR';
let nextTransactionID = 0;
export default function (store) {
  return next => action => {
    if (!action.meta || action.meta.synced !== false) {
      //skip changes received from DB (supersedes optimism)
      return next(action);
    }
    const {type, meta, payload} = action;
    //if we don't want to optimistically update (for actions with high % of failure)
    if (!meta.isOptimistic) return next(action);

    let transactionID = nextTransactionID++;
    next(Object.assign({}, action, {optimist: {type: BEGIN, id: transactionID}})); //execute optimistic update
    const socket = socketCluster.connect(socketOptions);
    socket.emit(type, payload, (_e,error) => {
      next({
        type: type + (error ? _ERROR : _SUCCESS),
        error,
        payload,
        meta: {synced: true},
        optimist: error ? {type: REVERT, id: transactionID} : {type: COMMIT, id: transactionID}
      });
    });
  }
};
