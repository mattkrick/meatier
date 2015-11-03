import {BEGIN, COMMIT, REVERT} from 'redux-optimist';
import io from 'socket.io-client';
const socket = io.connect(); //should be at top?
import {findInState} from '../helpers.js';
import rootSchema from '../schemas.js';
import Joi from 'joi';
//import promisify from 'es6-promisify';

//const validate = promisify(Joi.validate);
const _SUCCESS = '_SUCCESS';
const _ERROR = '_ERROR';
let nextTransactionID = 0;
export default function (store) {
  return next => action => {
    if (action.type !== 'ADD_DOC') {
      return next(action); //skip changes coming from DB (supersedes optimism)
    }
    const {type, meta, payload} = action;
    const {table} = meta;
    //const schema = rootSchema[table];

    //Schema validation
    //if (!schema) return dispatchAction('Cannot find schema on client', false);
    //action.payload.id = '';
    //const schemaError = Joi.validate(action.payload, schema).error;
    //if (schemaError) return dispatchAction(schemaError.message, false);
    //if (!meta.isOptimistic) return next(action); //if we don't want to optimistically update (not sure why)
    let transactionID = nextTransactionID++;
    next(Object.assign({}, action, {optimist: {type: BEGIN, id: transactionID}})); //execute optimistic update
    socket.emit(type, payload, table, err => {
      if (err) {
        next({
          type: type + _ERROR,
          err,
          payload,
          meta: {synced: true},
          optimist: {type: REVERT, id: transactionID}
        });
        return;
      }
      next({
        type: type +  _SUCCESS,
        payload,
        meta: {synced: true},
        optimist: {type: COMMIT, id: transactionID}
      });
      //dispatchAction(err, true); //complete transaction
    });
    function dispatchAction(error, willRevert) {
      if (error) debugger;
      console.log(error ? (willRevert && {type: REVERT, id: transactionID}) : {type: COMMIT, id: transactionID});
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
