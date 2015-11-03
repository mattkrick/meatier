import {addImmutable, updateImmutable, deleteImmutable} from '../helpers.js';
import uuid from 'node-uuid';
import io from 'socket.io-client';

const NOTES = 'notes';
const NOTES_CHANGE = 'NOTES_CHANGE';
export const ADD_NOTE_LOCALLY = 'ADD_NOTE_LOCALLY';
const ADD_NOTE_SUCCESS = 'ADD_NOTE_SUCCESS';
const ADD_NOTE_FAILURE = 'ADD_NOTE_FAILURE';
export const UPDATE_NOTE_LOCALLY = 'UPDATE_NOTE_LOCALLY';
const UPDATE_NOTE_SUCCESS = 'UPDATE_NOTE_SUCCESS';
const UPDATE_NOTE_FAILURE = 'UPDATE_NOTE_FAILURE';
export const DELETE_NOTE_LOCALLY = 'DELETE_NOTE_LOCALLY';
const DELETE_NOTE_SUCCESS = 'DELETE_NOTE_SUCCESS';
const DELETE_NOTE_FAILURE = 'DELETE_NOTE_FAILURE';

const initialState = {
  synced: false,
  error: null,
  data: []
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_NOTE_LOCALLY:
      return Object.assign({}, state, {
        synced: true,
        error: null,
        data: addImmutable(action.event, state.data) //adds locally
      });

    case UPDATE_NOTE_LOCALLY:
      return Object.assign({}, state, {
        synced: true,
        error: null,
        data: updateImmutable(action.event, state.data)
      });

    case DELETE_NOTE_LOCALLY:
      return Object.assign({}, state, {
        synced: true,
        error: null,
        data: deleteImmutable(action.event, state.data)
      });

    case ADD_NOTE_SUCCESS:
    case UPDATE_NOTE_SUCCESS: //changes _persisted to true
      //console.log(action);
      return Object.assign({}, state, {
        synced: false,
        error: null,
        data: updateImmutable(action.event, state.data)
      });

    case DELETE_NOTE_SUCCESS:
      return Object.assign({}, state, {
        synced: false,
        error: null
      });

    case ADD_NOTE_FAILURE: //roll back
      return Object.assign({}, state, {
        synced: false,
        error: action.error,
        data: deleteImmutable(action.event, state.data)
      });

    case UPDATE_NOTE_FAILURE: //roll back
      return Object.assign({}, state, {
        synced: false,
        error: action.error,
        data: updateImmutable(action.old, state.data)
      });

    case DELETE_NOTE_FAILURE: //roll back
      return Object.assign({}, state, {
        synced: false,
        error: action.error,
        data: addImmutable(action.event, state.data)
      });

    default:
      return state;
  }
}

/*
 * ACTION CREATORS
 */
export function addNote(laneId) {
  const newNote = {
    id: uuid.v4(),
    laneId: laneId,
    text: 'New note',
    table: NOTES
  };
  return dispatch => {
    dispatch(addNoteLocally(newNote));
    const socket = io.connect();
    //console.log('emitting: ', ADD_NOTE_LOCALLY, newNote);
    socket.emit(ADD_NOTE_LOCALLY, newNote, (err,res) => {
      //console.log('result from request:', err, res);
      if (err) {
        dispatch(addNoteFailure(err, newNote)); //remove from local state
        return;
      }
      dispatch(addNoteSuccess(newNote));
    });
  }
}

/*
* ACTIONS
*/
export function addNoteLocally(event) {
  return {
    type: ADD_NOTE_LOCALLY,
    event
  }
}

export function deleteNoteLocally(event) {
  return {
    type: DELETE_NOTE_LOCALLY,
    event
  };
}

export function updateNoteLocally(event) {
  return {
    type: UPDATE_NOTE_LOCALLY,
    event
  };
}

export function addNoteSuccess(event) {
  return {
    type: ADD_NOTE_SUCCESS,
    event
  };
}


export function deleteNoteSuccess(event) {
  return {
    type: DELETE_NOTE_SUCCESS,
    event
  };
}

export function updateNoteSuccess(event) {
  return {
    type: UPDATE_NOTE_SUCCESS,
    event
  };
}

export function addNoteFailure(error, event) {
  return {
    type: ADD_NOTE_FAILURE,
    error,
    event
  };
}

export function deleteNoteFailure(error, event) {
  return {
    type: DELETE_NOTE_FAILURE,
    error,
    event
  };
}

export function updateNoteFailure(error, event) {
  return {
    type: UPDATE_NOTE_FAILURE,
    error,
    event
  };
}

export const actions = {
  addNote
};

export const handleChange = {
  [NOTES_CHANGE]: {
    addLocally: addNoteLocally,
    updateLocally: updateNoteLocally,
    deleteLocally: deleteNoteLocally,
    stateKey: NOTES
  }
};
