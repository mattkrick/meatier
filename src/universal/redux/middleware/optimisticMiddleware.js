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
    //console.log(action);
    if (!action.meta || action.meta.synced !== false) {
      return next(action); //skip changes coming from DB (supersedes optimism)
    }
    const {type, meta, payload} = action;
    //const {table} = meta;
    //if we don't want to optimistically update (for docs with high % of failure)
    if (!meta.isOptimistic) return next(action);
    let transactionID = nextTransactionID++;
    next(Object.assign({}, action, {optimist: {type: BEGIN, id: transactionID}})); //execute optimistic update
    console.log('emitting', type, payload);
    socket.emit(type, payload, err => {
      dispatchAction(err, true); //complete transaction
    });
    function dispatchAction(error, willRevert) {
      payload.title += ' (server}';
      next({
        type: type + (error ? _ERROR : _SUCCESS),
        error,
        payload,
        meta: {synced: true},
        optimist: error ? (willRevert && {type: REVERT, id: transactionID}) : {type: COMMIT, id: transactionID}
      });
    }
  }
};
