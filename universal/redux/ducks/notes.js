import {addDoc, updateDoc, deleteDoc} from './docs.js';
import uuid from 'node-uuid';
import Joi from 'joi';

export const NOTES = 'notes'; //rethinkdb table name

export const noteSchema = Joi.object().keys({
  id: Joi.string().min(3).max(36).required(),
  text: Joi.string().max(200).required(),
  laneId: Joi.string().min(3).max(36).required()
});

export function addNote() {
  return addDoc({
    payload: {
      id: uuid.v4(),
      text: 'New note'
    },
    meta: {
      table: NOTES,
      isOptimistic: true,
      synced: false
    }
  });
}

export const actions = {
  addNote
};


