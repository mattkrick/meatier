import {addImmutable, updateImmutable, deleteImmutable} from '../helpers.js';
import uuid from 'node-uuid';
import Joi from 'joi';
import update from 'react/lib/update';

/*
 * Action types
 */
export const NOTES = 'notes'; //rethinkdb table name
export const NOTE = 'note'; //component (used for dnd)
//export const NOTES_CHANGE = 'NOTES_CHANGE'; // socket message
export const ADD_NOTE = 'ADD_NOTE';
export const UPDATE_NOTE = 'UPDATE_NOTE';
export const DELETE_NOTE = 'DELETE_NOTE';
export const MOVE_NOTE = 'MOVE_NOTE';
const ADD_NOTE_SUCCESS = 'ADD_NOTE_SUCCESS';
const UPDATE_NOTE_SUCCESS = 'UPDATE_NOTE_SUCCESS';
const DELETE_NOTE_SUCCESS = 'DELETE_NOTE_SUCCESS';
const MOVE_NOTE_SUCCESS = 'MOVE_NOTE_SUCCESS';
const ADD_NOTE_ERROR = 'ADD_NOTE_ERROR';
const UPDATE_NOTE_ERROR = 'UPDATE_NOTE_ERROR';
const DELETE_NOTE_ERROR = 'DELETE_NOTE_ERROR';
const MOVE_NOTE_ERROR = 'MOVE_NOTE_ERROR';

/*
 * Schemas
 */
const noteTextSchema = Joi.string().max(200).trim().required();
const fullNoteSchema = Joi.object().keys({
  id: Joi.string().min(3).max(36).required(),
  title: noteTextSchema,
  laneId: Joi.string().min(3).max(36),
  laneIdx: Joi.number().integer()
});

export const noteSchema = {
  full: fullNoteSchema,
  title: noteTextSchema
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
  switch (action.type) {
    case ADD_NOTE:
      return Object.assign({}, state, {
        synced: action.meta && action.meta.synced || false,
        data: addImmutable(action.payload, state.data)
      });

    case UPDATE_NOTE:
      return Object.assign({}, state, {
        synced: action.meta && action.meta.synced || false,
        data: updateImmutable(action.payload, state.data)
      });

    case DELETE_NOTE:
      return Object.assign({}, state, {
        synced: action.meta && action.meta.synced || false,
        data: deleteImmutable(action.payload.id, state.data)
      });

    case MOVE_NOTE:
      const currentIndex = state.findIndex((note) => note.id === action.payload.noteId);
      const movedNote = update(state[currentIndex], {laneId: {$set: action.payload.laneId}});
      const newIndex = action.payload.laneIdx;
      //const newIndex = state.findIndex((note) => note.id === action.putAfterId);
      return update(state, {
        $splice: [
          [currentIndex, 1],
          [newIndex, 0, movedNote]
          //[newIndex, 0, movedNote]
        ]
      });

    case ADD_NOTE_SUCCESS:
    case UPDATE_NOTE_SUCCESS:
    case DELETE_NOTE_SUCCESS:
      return Object.assign({}, state, {
        synced: true,
        error: null
      });

    case ADD_NOTE_ERROR:
    case UPDATE_NOTE_ERROR:
    case DELETE_NOTE_ERROR:
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
const meta = {
  table: NOTES,
  isOptimistic: true,
  synced: false
};

export function addNote() {
  return {
    type: ADD_NOTE,
    payload: {
      id: uuid.v4(),
      title: 'New note'
    },
    meta
  };
}

export function updateNote(id, title) {
  return {
    type: UPDATE_NOTE,
    payload: {
      id, title
    },
    meta
  };
}

export function deleteNote(id) {
  return {
    type: DELETE_NOTE,
    payload: {
      id
    },
    meta
  };
}

export function moveNote(noteId, laneId, laneIdx) {
  return {
    type: MOVE_NOTE,
    payload: {
      noteId,
      laneId,
      laneIdx
    }
  };
}

export const noteActions = {
  addNote,
  updateNote,
  deleteNote,
  moveNote
};


