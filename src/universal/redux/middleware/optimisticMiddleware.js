import socketCluster from 'socketcluster-client';
import socketOptions from 'universal/utils/socketOptions';
import {BEGIN, COMMIT, REVERT} from 'redux-optimistic-ui';

const _SUCCESS = '_SUCCESS';
const _ERROR = '_ERROR';
let nextTransactionID = 0;
export default () => next => action => {
  if (!action.meta || action.meta.synced !== false) {
    // skip non-document actions or changes received from DB (supersedes optimism)
    return next(action);
  }
  const {type, meta, payload} = action;
  // if we don't want to optimistically update (for actions with high % of failure)
  if (!meta.isOptimistic) {
    return next(action);
  }

  const transactionID = nextTransactionID++;
  next(Object.assign({}, action, {meta: {optimistic: {type: BEGIN, id: transactionID}}})); // execute optimistic update
  const socket = socketCluster.connect(socketOptions);
  socket.emit('graphql', payload, error => {
    next({
      type: type + (error ? _ERROR : _SUCCESS),
      error,
      payload,
      meta: {
        synced: true,
        optimistic: error ? {type: REVERT, id: transactionID} : {type: COMMIT, id: transactionID}
      }
    });
  });
};
