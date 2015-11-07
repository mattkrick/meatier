import {addDoc, updateDoc, deleteDoc} from './docs.js';
import uuid from 'node-uuid';
import Joi from 'joi';

export const NOTES = 'notes'; //rethinkdb table name
export const NOTE = 'note'; //component (used for dnd)

export const noteTextSchema = Joi.string().max(200).trim().required();
export const noteSchema = Joi.object().keys({
  id: Joi.string().min(3).max(36).required(),
  text: noteTextSchema,
  laneId: Joi.string().min(3).max(36),
  laneIdx: Joi.number().integer()
});

/*
 *Action creators
 */
const meta = {
  table: NOTES,
  isOptimistic: true,
  synced: false
};

export function addNote(laneId, laneIdx) {
  return addDoc({
    payload: {
      id: uuid.v4(),
      text: 'New note',
      laneId,
      laneIdx
    },
    meta
  });
}

export function updateNote(id, text) {
  return updateDoc({
    payload: {
      id, text
    },
    meta
  });
}

export function moveNote(noteId, putAfterIdx, laneId) {
  return addDoc({
    payload: {
      id: uuid.v4(),
      text: 'New note',
      laneId,
      laneIdx
    },
    meta
  });
}

export function deleteNote(id) {
  return deleteDoc({
    payload: {
      id
    },
    meta
  });
}

export const actions = {
  addNote,
  updateNote,
  deleteNote
};


