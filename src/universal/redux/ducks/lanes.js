import {addImmutable, updateImmutable, deleteImmutable} from '../helpers.js';
import uuid from 'node-uuid';
//import Joi from 'joi';
import io from 'socket.io-client';
//import thinky from '../../utils/thinky';
import Joi from 'joi';

/*
 * Schema
 */

const laneTextSchema = Joi.string().max(200).trim().required();
const fullLaneSchema = Joi.object().keys({
  id: Joi.string().min(3).max(36).required(),
  text: laneTextSchema
});

export const laneSchema = {
  full: fullLaneSchema,
  text: laneTextSchema
};

/*
 * Action types
 */
export const LANES = 'lanes'; //db table
//export const LANES_CHANGE = 'LANES_CHANGE'; // socket message
export const LOAD_LANES = 'LOAD_LANES';
export const ADD_LANE = 'ADD_LANE';
export const UPDATE_LANE = 'UPDATE_LANE';
export const DELETE_LANE = 'DELETE_LANE';
const ADD_LANE_SUCCESS = 'ADD_LANE_SUCCESS';
const UPDATE_LANE_SUCCESS = 'UPDATE_LANE_SUCCESS';
const DELETE_LANE_SUCCESS = 'DELETE_LANE_SUCCESS';
//const LOAD_LANES_SUCCESS = 'LOAD_LANES_SUCCESS';
const ADD_LANE_ERROR = 'ADD_LANE_ERROR';
const UPDATE_LANE_ERROR = 'UPDATE_LANE_ERROR';
const DELETE_LANE_ERROR = 'DELETE_LANE_ERROR';
const LOAD_LANES_ERROR = 'LOAD_LANES_ERROR';


/*
 * Reducer
 */
const initialState = {
  synced: false,
  error: null,
  data: []
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_LANES:
      //caching?
      return Object.assign({}, action.payload);
    case ADD_LANE:
      return Object.assign({}, state, {
        synced: action.meta && action.meta.synced || false,
        data: addImmutable(action.payload, state.data)
      });

    case UPDATE_LANE:
      return Object.assign({}, state, {
        synced: action.meta && action.meta.synced || false,
        data: updateImmutable(action.payload, state.data)
      });

    case DELETE_LANE:
      return Object.assign({}, state, {
        synced: action.meta && action.meta.synced || false,
        data: deleteImmutable(action.payload.id, state.data)
      });

    case ADD_LANE_SUCCESS:
    case UPDATE_LANE_SUCCESS:
    case DELETE_LANE_SUCCESS:
      return Object.assign({}, state, {
        synced: true,
        error: null
      });

    case ADD_LANE_ERROR:
    case UPDATE_LANE_ERROR:
    case DELETE_LANE_ERROR:
    case LOAD_LANES_ERROR:
      return Object.assign({}, state, {
        synced: true,
        error: action.error || 'Error'
      });

    default:
      return state;
  }
}

/*
 *Action creators
 */
const baseMeta = {
  table: LANES,
  isOptimistic: true,
  synced: false
};

export function loadLanes(payload) {
  return {
    type: LOAD_LANES,
    payload
  };
}

export function getAllLanes() {
  const socket = io();
  return dispatch => {
    socket.emit(LOAD_LANES, (error, lanes) => {
      if (error) {
        dispatch({type: LOAD_LANES_ERROR});
        return;
      }
      const payload = {
        data: lanes,
        synced: true,
        error: null
      };
      dispatch(loadLanes(payload));
    });
  }
}

export function addLane(payload, meta) {
  return {
    type: ADD_LANE,
    payload: payload || {
      id: uuid.v4(),
      text: 'New lane'
    },
    meta: Object.assign({}, baseMeta, meta)
  };
}

export function updateLane(payload, meta) {
  return {
    type: UPDATE_LANE,
    payload,
    meta: Object.assign({}, baseMeta, meta)
  };
}

export function deleteLane(id, meta) {
  return {
    type: DELETE_LANE,
    payload: {
      id
    },
    meta: Object.assign({}, baseMeta, meta)
  };
}

export const laneActions = {
  addDoc: addLane,
  updateDoc: updateLane,
  deleteDoc: deleteLane,
  loadDoc: loadLanes
};


