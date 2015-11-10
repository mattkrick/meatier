import {addImmutable, updateImmutable, deleteImmutable} from '../helpers.js';
import uuid from 'node-uuid';
import Joi from 'joi';

/*
 * Action types
 */
export const LANES = 'lanes'; //db table
//export const LANES_CHANGE = 'LANES_CHANGE'; // socket message
export const ADD_LANE = 'ADD_LANE';
export const UPDATE_LANE = 'UPDATE_LANE';
export const DELETE_LANE = 'DELETE_LANE';
const ADD_LANE_SUCCESS = 'ADD_LANE_SUCCESS';
const UPDATE_LANE_SUCCESS = 'UPDATE_LANE_SUCCESS';
const DELETE_LANE_SUCCESS = 'DELETE_LANE_SUCCESS';
const ADD_LANE_ERROR = 'ADD_LANE_ERROR';
const UPDATE_LANE_ERROR = 'UPDATE_LANE_ERROR';
const DELETE_LANE_ERROR = 'DELETE_LANE_ERROR';

/*
 * Schemas
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
 * Reducer
 */
const initialState = {
  synced: false,
  error: null,
  data: []
};

export default function reducer(state = initialState, action = {}) {
  //if (!action.meta || !table || action.meta.table !== table) return state;
  switch (action.type) {
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
  deleteDoc: deleteLane
};


