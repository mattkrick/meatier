import {addImmutable, updateImmutable, deleteImmutable} from '../helpers.js';
import uuid from 'node-uuid';
import io from 'socket.io-client';

/*
* action types
*/
export const DOCS_CHANGE = 'DOCS_CHANGE'; // socket message
export const ADD_DOC = 'ADD_DOC';
export const UPDATE_DOC = 'UPDATE_DOC';
export const DELETE_DOC = 'DELETE_DOC';
const ADD_DOC_SUCCESS = 'ADD_DOC_SUCCESS';
const UPDATE_DOC_SUCCESS = 'UPDATE_DOC_SUCCESS';
const DELETE_DOC_SUCCESS = 'DELETE_DOC_SUCCESS';
const ADD_DOC_ERROR = 'ADD_DOC_ERROR';
const UPDATE_DOC_ERROR = 'UPDATE_DOC_ERROR';
const DELETE_DOC_ERROR = 'DELETE_DOC_ERROR';
//const IS_EDITING_DOC = 'IS_EDITING_DOC';

const initialState = {
  synced: false,
  error: null,
  data: []
};

export default function reducer(state = initialState, action = {}, table) {
  if (!action.meta || !table || action.meta.table !== table) return state;
  switch (action.type) {
    case ADD_DOC:
      return Object.assign({}, state, {
        synced: action.meta && action.meta.synced || false,
        data: addImmutable(action.payload, state.data)
      });

    case UPDATE_DOC:
      return Object.assign({}, state, {
        synced: action.meta && action.meta.synced || false,
        data: updateImmutable(action.payload, state.data)
      });

    case DELETE_DOC:
      return Object.assign({}, state, {
        synced: action.meta && action.meta.synced || false,
        data: deleteImmutable(action.payload.id, state.data)
      });

    case ADD_DOC_SUCCESS:
    case UPDATE_DOC_SUCCESS:
    case DELETE_DOC_SUCCESS:
      return Object.assign({}, state, {
        synced: true,
        error: null
      });

    case ADD_DOC_ERROR:
    case UPDATE_DOC_ERROR:
    case DELETE_DOC_ERROR:
      return Object.assign({}, state, {
        synced: true,
        error: action.error || 'Error'
      });

    default:
      return state;
  }
}

/*
 * ACTIONS
 */
export function addDoc(action) {
  return {
    type: ADD_DOC,
    ...action
  }
}

export function deleteDoc(action) {
  return {
    type: DELETE_DOC,
    ...action
  };
}

export function updateDoc(action) {
  return {
    type: UPDATE_DOC,
    ...action
  };
}
