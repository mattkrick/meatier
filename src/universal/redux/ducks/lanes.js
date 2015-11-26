import {addImmutable, updateImmutable, deleteImmutable} from '../helpers.js';
import uuid from 'node-uuid';
import Joi from 'joi';
import socketCluster from 'socketcluster-client';
import socketOptions from '../../utils/socketOptions';
import {deleteNote} from './notes';

/*
 * Schema
 */
const idSchema = Joi.string().min(3).max(36);
export const laneSchemaUpdate = Joi.object({
  id: idSchema.required(),
  title: Joi.string().max(30).trim(),
  userId: idSchema,
  isPrivate: Joi.boolean()
});
export const laneSchemaInsert = laneSchemaUpdate.requiredKeys('title', 'userId');

/*
 * Action types
 */
export const LANES = 'lanes'; //db table
export const ADD_LANE = 'ADD_LANE';
export const UPDATE_LANE = 'UPDATE_LANE';
export const DELETE_LANE = 'DELETE_LANE';
const CLEAR_LANES = 'CLEAR_LANES'; //local state flush
const ADD_LANE_SUCCESS = 'ADD_LANE_SUCCESS';
const UPDATE_LANE_SUCCESS = 'UPDATE_LANE_SUCCESS';
const DELETE_LANE_SUCCESS = 'DELETE_LANE_SUCCESS';
const ADD_LANE_ERROR = 'ADD_LANE_ERROR';
const UPDATE_LANE_ERROR = 'UPDATE_LANE_ERROR';
const DELETE_LANE_ERROR = 'DELETE_LANE_ERROR';


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
    case CLEAR_LANES:
      return Object.assign({}, initialState)

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

export function loadLanes() {
  const sub = 'allLanes';
  const socket = socketCluster.connect(socketOptions); //GOTCHA: must put it in the function otherwise server hangs up
  socket.subscribe(sub, {waitForAuth: true});
  return dispatch => {
    socket.on(sub, data => {
      const meta = {synced: true};
      if (!data.old_val) {
        dispatch(addLane(data.new_val, meta));
      } else if (!data.new_val) {
        dispatch(deleteLane(data.old_val.id, meta));
      } else {
        dispatch(updateLane(data.new_val, meta))
      }
    })
    socket.on('unsubscribe', channelName => {
      if (channelName === sub) {
        dispatch({type: CLEAR_LANES});
      }
    })
  }
}

export function addLane(payload, meta) {
  return {
    type: ADD_LANE,
    payload,
    meta: Object.assign({}, baseMeta, meta)
  }
}

export function updateLane(payload, meta) {
  return {
    type: UPDATE_LANE,
    payload,
    meta: Object.assign({}, baseMeta, meta)
  };
}

export function deleteLane(id, meta) {
  return (dispatch, getState) => {
    const noteState = getState().notes;
    if (noteState && noteState.data) {
      noteState.data.forEach(note => {
        if (note.laneId === id) {
          dispatch(deleteNote(note.id))
        }
      })
    }
    dispatch({
      type: DELETE_LANE,
      payload: {id},
      meta: Object.assign({}, baseMeta, meta)
    });
  }
}

export const laneActions = {
  addLane,
  updateLane,
  deleteLane
};

//There are 2 ways to handle deleting linked docs
//1. In the thinky model, when a lane is deleted, it deletes all notes
//PRO: simple CON: disallows squash because if a document is created & deleted within the squash, changefeed doesn't emit
//It also means an extra changefeed doc is sent to the client (whereas options 2 only send an id to delete)
//2. redux thunk - when a lane delete is called, search state & remove those notes
//PRO: client does child-lookup, not DB. CON: can't delete what the client cant see (could be a PRO?)
