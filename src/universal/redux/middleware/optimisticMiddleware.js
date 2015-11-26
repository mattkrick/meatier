import {BEGIN, COMMIT, REVERT} from 'redux-optimist';
import socketCluster from 'socketcluster-client';
import socketOptions from '../../utils/socketOptions';
const socket = socketCluster.connect(socketOptions);
import {findInState} from '../helpers.js';
//import rootSchema from '../schemas.js';
//import Joi from 'joi';
//const socket = {};

const _SUCCESS = '_SUCCESS';
const _ERROR = '_ERROR';
let nextTransactionID = 0;
export default function (store) {
  return next => action => {
    if (!action.meta || action.meta.synced !== false) {
      return next(action); //skip changes received from DB (supersedes optimism)
    }
    const {type, meta, payload} = action;
    //if we don't want to optimistically update (for docs with high % of failure)
    if (!meta.isOptimistic) return next(action);
    let transactionID = nextTransactionID++;
    next(Object.assign({}, action, {optimist: {type: BEGIN, id: transactionID}})); //execute optimistic update

    socket.emit(type, payload, (_e,err) => {
      dispatchAction(err); //complete transaction
    });
    function dispatchAction(error) {
      //payload.title += ' (server}';
      next({
        type: type + (error ? _ERROR : _SUCCESS),
        error,
        payload,
        meta: {synced: true},
        optimist: error ? {type: REVERT, id: transactionID} : {type: COMMIT, id: transactionID}
      });
    }
  }
};
